// @collapse
import { db, gamesCollection, metaCollection } from "@/firebase";
import {
  doc,
  updateDoc,
  getDoc,
  setDoc,
  onSnapshot,
} from "@firebase/firestore";
import { isEqual } from "lodash";

export class Game {
  constructor(gameState, setGame, host = false) {
    for (const key in gameState) {
      this[key] = gameState[key];
    }

    this.host = host;
    this.setGame = setGame;
    this.updateGameState();
  }

  // returns a new Game instance
  static async createGame(username, setGame) {
    let code = Game.#generateCode();

    const deckDoc = doc(metaCollection, "deck");
    const drawPile = (await getDoc(deckDoc)).data().cards;

    const gameState = {
      code,
      status: "waiting",
      capacity: 4,
      currentPlayer: null,
      currentCard: null,
      drawPile,
      players: [
        {
          username,
          hand: [],
        },
      ],
    };

    const gameDoc = doc(gamesCollection, code);
    await setDoc(gameDoc, gameState);

    return new Game(gameState, setGame, true);
  }

  static async joinGame(code, username, setGame) {
    const gameDoc = doc(gamesCollection, code);
    const gameState = (await getDoc(gameDoc)).data();

    if (gameState.players.length < gameState.capacity) {
      gameState.players.push({
        username,
        hand: [],
      });
    }

    if (gameState.players.length === gameState.capacity) {
      gameState.status = "playing";
    }

    await updateDoc(gameDoc, gameState);

    return new Game(gameState, setGame, false);
  }

  async leaveGame(username) {
    const gameDoc = doc(gamesCollection, this.code);
    const indexOfPlayerLeaving = this.players.findIndex((item) => {
      return item.username === username;
    });

    this.players.splice(indexOfPlayerLeaving, 1);

    await updateDoc(gameDoc, this.#getGameStateFields());
    this.setGame(null);
  }

  // this will listen to the database and make the changes to the object whenever a change on the backend is made
  async updateGameState() {
    const gameDoc = doc(gamesCollection, this.code);

    const handleSnapshot = async (docSnapshot) => {
      const lastGameState = this.#getGameStateFields();
      const updatedGameState = docSnapshot.data();

      if (
        this.host &&
        lastGameState.status === "waiting" &&
        updatedGameState.status === "playing"
      ) {
        this.#shuffleCards(updatedGameState.drawPile);
        this.#dealCards(updatedGameState);
        this.status = "playing";
        await updateDoc(gameDoc, updatedGameState);
        return;
      }

      if (!isEqual(updatedGameState, lastGameState)) {
        this.setGame(new Game(updatedGameState, this.setGame, this.host));
        unsubscribe();
      }
    };

    const unsubscribe = onSnapshot(gameDoc, handleSnapshot);
  }

  #getGameStateFields() {
    return {
      capacity: this.capacity,
      code: this.code,
      currentCard: this.currentCard,
      currentPlayer: this.currentPlayer,
      drawPile: this.drawPile,
      players: this.players,
      status: this.status,
    };
  }

  // TO-DO
  async endGame() {}

  #shuffleCards(deck) {
    console.log("shuffling");
  }

  #dealCards(gameState) {
    for (let i = 0; i < 7; i++) {
      for (let j = 0; j < 4; j++) {
        const topCard = gameState.drawPile.pop();
        gameState.players[j].hand.push(topCard);
      }
    }
  }

  getPlayerHand(username) {
    const indexOfPlayer = this.players.findIndex((item) => {
      return item.username === username;
    });

    return this.players[indexOfPlayer].hand;
  }

  static #generateCode() {
    const codeArray = [];

    for (let i = 0; i < 4; i++) {
      codeArray.push(Math.floor(Math.random() * 10));
    }

    return codeArray.join("");
  }
}
