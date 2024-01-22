import { db, gamesCollection, metaCollection } from "@/firebase";
import { doc, updateDoc, getDoc, setDoc, onSnapshot } from "@firebase/firestore";
import { isEqual } from "lodash";

export class Game {
  constructor(gameState, setGame, mediator) {
    for (const key in gameState) {
      this[key] = gameState[key];
    }

    this.setGame = setGame;
    this.mediator = mediator;

    this.mediator.registerGame(this);
    this.setGame(this);
  }

  getGameStateFields() {
    return {
      capacity: this.capacity,
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
    console.log("shuffling");
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = deck[i];
      deck[i] = deck[j];
      deck[j] = temp;
    }
  }

  dealCards(gameState) {
    for (let i = 0; i < 7; i++) {
      for (let j = 0; j < 4; j++) {
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

  updateState() {
    new Game(this.getGameStateFields(), this.setGame, this.mediator);
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
  constructor(username, setPlayer, mediator, hand = [], host = false, selected = []) {
    this.username = username;
    this.setPlayer = setPlayer;
    this.hand = hand;
    this.selected = selected;
    this.host = host;
    this.mediator = mediator;

    this.mediator.registerPlayer(this);
    this.setPlayer(this);
  }

  handleCardSelection(card) {
    if (this.selected.includes(card)) {
      this.deselectCard(card);
    } else {
      this.selectCard(card);
    }

    console.log(this.selected);
  }

  deselectCard(card) {
    const indexOfCard = this.selected.findIndex((item) => {
      return item === card;
    });

    this.selected.splice(indexOfCard, 1);
  }

  selectCard(card) {
    this.selected.push(card);
  }

  async takeTurn() {
    await this.mediator.takeTurn();
  }

  async drawCard() {
    await this.mediator.drawCard();
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

  async createGame(username, setPlayer, setGame) {
    let code = Game.generateCode();

    this.gameDoc = doc(gamesCollection, code);

    const deckDoc = doc(metaCollection, "deck");
    const drawPile = (await getDoc(deckDoc)).data().cards;

    const gameState = {
      code,
      status: "waiting",
      capacity: 4,
      currentPlayer: null,
      currentCard: null,
      drawPile,
      playedPile: [],
      players: [
        {
          username: username,
          hand: [],
        },
      ],
    };

    await setDoc(this.gameDoc, gameState);

    new Game(gameState, setGame, this);
    new Player(username, setPlayer, this, [], true, []);

    this.registerUpdateListener();
  }

  async joinGame(username, code, setPlayer, setGame) {
    this.gameDoc = doc(gamesCollection, code);

    const gameState = (await getDoc(this.gameDoc)).data();

    if (gameState.players.length <= gameState.capacity) {
      gameState.players.push({
        username,
        hand: [],
      });
    }

    await updateDoc(this.gameDoc, gameState);

    new Game(gameState, setGame, this);
    new Player(username, setPlayer, this, [], false, []);

    this.registerUpdateListener();
  }

  async leaveGame() {
    this.game.players.splice(this.playerIndex, 1);

    this.unsubscribe();
    await updateDoc(this.gameDoc, this.game.getGameStateFields());

    this.game.setGame(null);
    this.player.setPlayer(null);
    this.setMediator(null);
  }

  async takeTurn() {
    if (this.validateTurn()) {
      console.log("valid turn");
      const gameObjCopy = JSON.parse(JSON.stringify(this.game.getGameStateFields()));

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

      gameObjCopy.players[this.playerIndex].hand = updatedHand;
      gameObjCopy.currentPlayer = (this.game.currentPlayer + 1) % gameObjCopy.capacity;
      gameObjCopy.currentCard = lastSelectedCardObj;
      this.player.selected = [];

      await updateDoc(this.gameDoc, gameObjCopy);
    } else {
      console.log("invalid turn");
    }
  }

  async drawCard() {
    const gameObjCopy = JSON.parse(JSON.stringify(this.game.getGameStateFields()));
    const topCard = gameObjCopy.drawPile.pop();
    // TO-DO: handle case where topCard is undefined because drawPile is empty
    gameObjCopy.players[this.playerIndex].hand.push(topCard);
    await updateDoc(this.gameDoc, gameObjCopy);
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
  }

  registerPlayer(player) {
    this.player = player;
    this.playerIndex = this.getPlayerIndex();
  }

  getPlayerIndex() {
    return this.game.players.findIndex((item) => {
      return item.username === this.player.username;
    });
  }

  getOrderOfPlayers(gameState) {
    const order = [];

    for (let i = this.playerIndex; i < gameState.capacity; i++) {
      order.push(gameState.players[i]);
    }

    for (let i = 0; i < this.playerIndex; i++) {
      order.push(gameState.players[i]);
    }

    return order;
  }

  // this will listen to the database and make the changes to the object whenever a change on the backend is made
  async registerUpdateListener() {
    const handleSnapshot = async (docSnapshot) => {
      const lastGameState = this.game.getGameStateFields();
      const updatedGameState = docSnapshot.data();

      console.log(updatedGameState.players[this.playerIndex].hand, this.player.hand);

      if (lastGameState.status === "waiting" && updatedGameState.status === "playing") {
        this.orderOfPlayers = this.getOrderOfPlayers(updatedGameState);
      }

      if (this.player.host && updatedGameState.status === "waiting" && updatedGameState.players.length === updatedGameState.capacity) {
        this.game.shuffleCards(updatedGameState.drawPile);
        this.game.dealCards(updatedGameState);
        this.game.drawFirstCard(updatedGameState);
        updatedGameState.currentPlayer = 0;
        updatedGameState.status = "playing";
        await updateDoc(this.gameDoc, updatedGameState);
        return;
      }

      if (!isEqual(updatedGameState, lastGameState)) {
        console.log("updating game state");
        new Game(updatedGameState, this.game.setGame, this);
      }

      if (!isEqual(updatedGameState.players[this.playerIndex].hand, this.player.hand)) {
        console.log("updating player state");
        new Player(this.player.username, this.player.setPlayer, this, updatedGameState.players[this.playerIndex].hand, this.player.host, this.player.selected);
      }
    };

    const unsubscribe = onSnapshot(this.gameDoc, handleSnapshot);
    this.unsubscribe = unsubscribe;
  }
}

class StateManager {
  compareGamestate(oldGameState, newGameState) {}
}
