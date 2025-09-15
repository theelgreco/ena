import { gamesCollection, metaCollection } from "@/firebase/firestore/collections";
import { getErrorMessage } from "@/lib/errors";
import { doc, updateDoc, getDoc, setDoc, onSnapshot } from "@firebase/firestore";
import { isEqual } from "lodash";
import { useState } from "react";
import { toast } from "sonner";

export class Game {
  constructor(gameState, setGame, mediator, stateManager) {
    for (const key in gameState) {
      this[key] = gameState[key];
    }

    this.status = null;
    this.setGame = setGame;
    this.mediator = mediator;
    this.stateManager = stateManager;

    this.mediator.registerGame(this);
    this.setGame(this);
  }

  getGameStateFields() {
    return {
      capacity: this.capacity,
      direction: this.direction,
      code: this.code,
      currentCard: this.currentCard,
      currentPlayer: this.currentPlayer,
      drawPile: this.drawPile,
      playedPile: this.playedPile,
      players: this.players,
      status: this.status,
    };
  }

  shuffleCards(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = deck[i];
      deck[i] = deck[j];
      deck[j] = temp;
    }
  }

  dealCards(gameState) {
    for (let i = 0; i < 7; i++) {
      for (let j = 0; j < gameState.capacity; j++) {
        const topCard = gameState.drawPile.pop();
        gameState.players[j].hand.push(topCard);
      }
    }
  }

  drawFirstCard(gameState) {
    const vals = ["+2", "+4", "skip", "switch", "wild"];
    const topCard = gameState.drawPile.pop();

    gameState.playedPile.push(topCard);
    gameState.currentCard = topCard;

    if (vals.includes(topCard.value)) {
      this.drawFirstCard(gameState);
    }
  }

  static generateCode() {
    const codeArray = [];

    for (let i = 0; i < 4; i++) {
      codeArray.push(Math.floor(Math.random() * 10));
    }

    return codeArray.join("");
  }
}

export class Player {
  constructor(username, setPlayer, mediator, hand = [], host = false, selected = [], stateManager) {
    this.username = username;
    this.setPlayer = setPlayer;
    this.hand = hand;
    this.selected = selected;
    this.host = host;
    this.mediator = mediator;
    this.stateManager = stateManager;

    this.mediator.registerPlayer(this);
    this.setPlayer(this);
  }

  handleCardSelection(card) {
    if (this.selected.includes(card)) {
      this.deselectCard(card);
    } else {
      this.selectCard(card);
    }
  }

  deselectCard(card) {
    const indexOfCard = this.selected.findIndex((item) => {
      return item === card;
    });

    this.selected.splice(indexOfCard, 1);

    if (!this.selected.length) {
      this.stateManager.setHasSelected(false);
    }
  }

  selectCard(card) {
    this.selected.push(card);

    if (!this.stateManager.hasSelected) {
      this.stateManager.setHasSelected(true);
    }
  }

  async playTurn() {
    await this.mediator.playTurn();

    this.stateManager.resetTurnState();
  }

  async drawCard() {
    await this.mediator.drawCard();
    this.stateManager.setHasDrawn(true);
  }

  async passTurn() {
    await this.mediator.passTurn();

    this.stateManager.resetTurnState();
  }
}

export class GameMediator {
  constructor(setMediator) {
    this.game = null;
    this.player = null;
    this.playerIndex = null;
    this.gameDoc = null;
    this.setMediator = setMediator;
    this.unsubscribe = null;
    this.orderOfPlayers = [];

    this.setMediator(this);
  }

  async createGame(capacity, username, photoURL, setPlayer, setGame, setStateManager) {
    let code = Game.generateCode();

    this.gameDoc = doc(gamesCollection, code);

    const deckDoc = doc(metaCollection, "deck");
    const drawPile = (await getDoc(deckDoc)).data().cards;

    const gameState = {
      code,
      status: null,
      direction: "forwards",
      capacity,
      currentPlayer: null,
      currentCard: null,
      drawPile,
      playedPile: [],
      players: [
        {
          username: username,
          photoURL: photoURL,
          hand: [],
        },
      ],
    };

    await setDoc(this.gameDoc, gameState);

    const stateManager = new StateManager(this, setStateManager);
    new Game(gameState, setGame, this, stateManager);
    new Player(username, setPlayer, this, [], true, [], stateManager);

    this.registerUpdateListener();

    await updateDoc(this.gameDoc, { status: "waiting" });
  }

  async joinGame(username, photoURL, code, setPlayer, setGame, setStateManager) {
    try {
      this.gameDoc = doc(gamesCollection, code);

      const gameState = (await getDoc(this.gameDoc)).data();

      if (!gameState) {
        throw new Error("Invalid game code");
      }

      if (gameState.players?.length <= gameState.capacity) {
        gameState.players.push({
          username,
          photoURL: photoURL,
          hand: [],
        });
      }

      const stateManager = new StateManager(this, setStateManager);
      new Game(gameState, setGame, this, stateManager);
      new Player(username, setPlayer, this, [], false, [], stateManager);

      this.registerUpdateListener();
      await updateDoc(this.gameDoc, gameState);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  }

  async leaveGame() {
    this.game.players.splice(this.playerIndex, 1);

    this.unsubscribe();
    await updateDoc(this.gameDoc, this.game.getGameStateFields());

    this.stateManager.initialiseState();
  }

  async playTurn() {
    const gameObjCopy = JSON.parse(JSON.stringify(this.game.getGameStateFields()));

    let playerIncrementAmount = 1;

    const nextPlayerIndex = this.getNextPlayerIndex(gameObjCopy, playerIncrementAmount);
    const nextPlayer = gameObjCopy.players[nextPlayerIndex];

    const lastSelectedCardIndex = this.player.selected[this.player.selected.length - 1];
    const lastSelectedCardObj = gameObjCopy.players[this.playerIndex].hand[lastSelectedCardIndex];
    const updatedHand = [];

    for (let i = 0; i < this.player.hand.length; i++) {
      if (!this.player.selected.includes(i)) {
        const currentCard = this.player.hand[i];
        updatedHand.push(currentCard);
      }
    }

    for (let i = 0; i < this.player.selected.length; i++) {
      const currentCardIndex = this.player.selected[i];
      const currentCardObj = gameObjCopy.players[this.playerIndex].hand[currentCardIndex];

      gameObjCopy.playedPile.push(currentCardObj);
    }

    switch (lastSelectedCardObj.value) {
      case "skip":
        playerIncrementAmount++;
        break;
      case "switch":
        gameObjCopy.direction = gameObjCopy.direction === "reverse" ? "forwards" : "reverse";
        break;
      case "+2":
        nextPlayer.hand.push(gameObjCopy.drawPile.pop());
        nextPlayer.hand.push(gameObjCopy.drawPile.pop());
        break;
      case "+4":
        nextPlayer.hand.push(gameObjCopy.drawPile.pop());
        nextPlayer.hand.push(gameObjCopy.drawPile.pop());
        nextPlayer.hand.push(gameObjCopy.drawPile.pop());
        nextPlayer.hand.push(gameObjCopy.drawPile.pop());
        break;
    }

    gameObjCopy.currentPlayer = this.getNextPlayerIndex(gameObjCopy, playerIncrementAmount);

    gameObjCopy.players[this.playerIndex].hand = updatedHand;
    gameObjCopy.currentCard = lastSelectedCardObj;
    this.player.selected = [];

    await updateDoc(this.gameDoc, gameObjCopy);
  }

  async drawCard() {
    const gameObjCopy = JSON.parse(JSON.stringify(this.game.getGameStateFields()));
    const topCard = gameObjCopy.drawPile.pop();
    const newHand = [...this.player.hand, topCard];
    // TO-DO: handle case where topCard is undefined because drawPile is empty

    gameObjCopy.players[this.playerIndex].hand = newHand;
    await updateDoc(this.gameDoc, gameObjCopy);

    this.stateManager.setHasDrawn(false);
  }

  async passTurn() {
    const gameObjCopy = JSON.parse(JSON.stringify(this.game.getGameStateFields()));

    gameObjCopy.currentPlayer = this.getNextPlayerIndex(gameObjCopy, 1);

    await updateDoc(this.gameDoc, gameObjCopy);
  }

  getNextPlayerIndex(gameState, playerIncrementAmount) {
    if (gameState.direction === "reverse") {
      const num = gameState.currentPlayer - playerIncrementAmount;
      return num < 0 ? gameState.capacity + num : num;
    } else {
      return (gameState.currentPlayer + playerIncrementAmount) % gameState.capacity;
    }
  }

  validateTurn() {
    const firstSelectionIndex = this.player.selected[0];
    const firstSelectionObj = this.game.players[this.playerIndex].hand[firstSelectionIndex];

    if (!this.player.selected.length) {
      return false;
    }

    if (firstSelectionObj.value !== this.game.currentCard.value && firstSelectionObj.colour !== this.game.currentCard.colour && firstSelectionObj.colour !== "black") {
      return false;
    }

    for (let i = 1; i < this.player.selected.length; i++) {
      const currentCardIndex = this.player.selected[i];
      const currentCardObj = this.game.players[this.playerIndex].hand[currentCardIndex];

      if (currentCardObj.value !== firstSelectionObj.value) {
        return false;
      }
    }

    return true;
  }

  registerGame(game) {
    this.game = game;
    this.stateManager.game = game;
  }

  registerPlayer(player) {
    this.player = player;
    this.stateManager.player = player;
    this.playerIndex = this.getPlayerIndex();
  }

  registerStateManager(stateManager) {
    this.stateManager = stateManager;
  }

  getPlayerIndex() {
    return this.game.players.findIndex((item) => {
      return item.username === this.player.username;
    });
  }

  getOrderOfPlayers(gameState) {
    const order = [];

    for (let i = this.playerIndex; i < gameState.capacity; i++) {
      order.push({ ...gameState.players[i], playerIndex: i });
    }

    for (let i = 0; i < this.playerIndex; i++) {
      order.push({ ...gameState.players[i], playerIndex: i });
    }

    return order;
  }

  // this will listen to the database and make the changes to the object whenever a change on the backend is made
  async registerUpdateListener() {
    const handleSnapshot = async (docSnapshot) => {
      const updatedGameState = docSnapshot.data();
      const lastGameState = this.game.getGameStateFields();

      this.stateManager.compareGameState(updatedGameState, lastGameState);
    };

    const unsubscribe = onSnapshot(this.gameDoc, handleSnapshot);
    this.unsubscribe = unsubscribe;
  }

  async getGameStateAfterReturningToTab() {
    const updatedGameState = (await getDoc(this.gameDoc)).data();
    const lastGameState = this.game.getGameStateFields();

    this.stateManager.compareGameState(updatedGameState, lastGameState);
  }
}

export class StateManager {
  constructor(mediator, setStateManager) {
    this.mediator = mediator;
    this.setStateManager = setStateManager;

    this.game = null;
    this.player = null;

    this.setPlayerHand = null;
    this.setCurrentCard = null;
    this.setCurrentPlayer = null;
    this.setPlayers = null;
    this.setStatus = null;

    this.mediator.registerStateManager(this);
    this.setStateManager(this);
  }

  initialiseState() {
    this.game.setGame(null);
    this.player.setPlayer(null);
    this.mediator.setMediator(null);

    this.game = null;
    this.player = null;
    this.mediator = null;

    this.setPlayerHand(null);
    this.setCurrentCard(null);
    this.setCurrentPlayer(null);
    this.setPlayers(null);
    this.setStatus(null);
  }

  registerGameState() {
    const [hasSelected, setHasSelected] = useState(false);
    this.hasSelected = hasSelected;
    this.setHasSelected = setHasSelected;

    const [hasDrawn, setHasDrawn] = useState(false);
    this.hasDrawn = hasDrawn;
    this.setHasDrawn = setHasDrawn;

    const [colourChoiceOpen, setColourChoiceOpen] = useState(false);
    this.colourChoiceOpen = colourChoiceOpen;
    this.setColourChoiceOpen = setColourChoiceOpen;
  }

  resetTurnState() {
    if (this.hasSelected) {
      this.setHasSelected(false);
    }

    if (this.hasDrawn) {
      this.setHasDrawn(false);
    }
  }

  async compareGameState(updatedGameState, lastGameState) {
    if (lastGameState.status === "waiting" && updatedGameState.status === "playing") {
      this.mediator.orderOfPlayers = this.mediator.getOrderOfPlayers(updatedGameState);

      for (let key in updatedGameState) {
        this.game[key] = updatedGameState[key];
      }

      this.player.hand = updatedGameState.players[this.mediator.playerIndex].hand;
      this.game.status = updatedGameState.status;

      this.setPlayerHand(updatedGameState.players[this.mediator.playerIndex].hand);
      this.setStatus(updatedGameState.status);
    } else if (this.game.status !== updatedGameState.status) {
      this.game.status = updatedGameState.status;
      this.setStatus(updatedGameState.status);
    }

    if (this.player.host && updatedGameState.status === "waiting" && updatedGameState.players.length === updatedGameState.capacity) {
      this.game.shuffleCards(updatedGameState.drawPile);
      this.game.dealCards(updatedGameState);
      this.game.drawFirstCard(updatedGameState);
      updatedGameState.currentPlayer = 0;
      updatedGameState.status = "playing";
      await updateDoc(this.mediator.gameDoc, updatedGameState);
      return;
    }

    if (!isEqual(updatedGameState.currentCard, lastGameState.currentCard)) {
      this.game.currentCard = updatedGameState.currentCard;
      this.setCurrentCard(updatedGameState.currentCard);
    }

    if (!isEqual(updatedGameState.currentPlayer, lastGameState.currentPlayer)) {
      this.game.currentPlayer = updatedGameState.currentPlayer;
      this.setCurrentPlayer(updatedGameState.currentPlayer);
    }

    if (!isEqual(updatedGameState.drawPile, lastGameState.drawPile)) {
      this.game.drawPile = updatedGameState.drawPile;
    }

    if (!isEqual(updatedGameState.playedPile, lastGameState.playedPile)) {
      this.game.playedPile = updatedGameState.playedPile;
    }

    if (!isEqual(updatedGameState.players.length, lastGameState.players.length)) {
      this.game.players = updatedGameState.players;
      this.setPlayers(updatedGameState.players);
    }

    if (!isEqual(updatedGameState.players[this.mediator.playerIndex].hand, this.player.hand)) {
      this.player.hand = updatedGameState.players[this.mediator.playerIndex].hand;
      this.setPlayerHand(updatedGameState.players[this.mediator.playerIndex].hand);
    }

    if (!isEqual(updatedGameState.players, this.game.players)) {
      this.game.players = updatedGameState.players;
    }

    if (!isEqual(updatedGameState.direction, this.game.direction)) {
      this.game.direction = updatedGameState.direction;
    }
  }
}

function animationFunc(fromElement, moveElement, reverse = false) {
  const { left: fromLeft, top: fromTop } = fromElement.getBoundingClientRect();
  const { left: toLeft, top: toTop } = moveElement.getBoundingClientRect();

  const startingPositionLeft = toLeft - fromLeft;
  const startingPositionTop = toTop - fromTop;

  const animationKeyframes = [{ transform: `translate(${-startingPositionLeft}px, ${-startingPositionTop}px)` }, { transform: "translate(0px, 0px)" }];
  const animationOptions = { duration: 400, fill: "forwards" };

  if (reverse) {
    const anim = moveElement.animate(animationKeyframes, animationOptions);
    anim.reverse();
  } else {
    moveElement.animate(animationKeyframes, animationOptions);
  }
}
