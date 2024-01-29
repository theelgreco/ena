"use client";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import React, { useEffect, useState } from "react";

import JoinGame from "@/components/JoinGame";
import WaitingRoom from "@/components/WaitingRoom";
import GameRoom from "@/components/GameRoom";

const componentLookup = {
  waiting: WaitingRoom,
  playing: GameRoom,
};

export default function Home() {
  const [game, setGame] = useState(null);
  const [player, setPlayer] = useState(null);
  const [mediator, setMediator] = useState(null);
  const [stateManager, setStateManager] = useState(null);

  const [players, setPlayers] = useState([]);
  const [status, setStatus] = useState("waiting");
  const [playerHand, setPlayerHand] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [currentCard, setCurrentCard] = useState(null);

  useEffect(() => {
    if (game) {
      console.log(game);
    }
  }, [game]);

  useEffect(() => {
    if (player) {
      console.log(player);
    }
  }, [player]);

  useEffect(() => {
    if (stateManager) {
      stateManager.setPlayers = setPlayers;
      stateManager.setStatus = setStatus;
      stateManager.setPlayerHand = setPlayerHand;
      stateManager.setCurrentPlayer = setCurrentPlayer;
      stateManager.setCurrentCard = setCurrentCard;
      stateManager.setPlayers(game.players);
    }
  }, [stateManager]);

  return (
    <main className="w-full h-full max-w-full max-h-full pt-24 home-screen-pb home-screen-px relative">
      {!game ? (
        <JoinGame game={game} setGame={setGame} setPlayer={setPlayer} setMediator={setMediator} setStateManager={setStateManager} />
      ) : (
        React.createElement(componentLookup[status], {
          player,
          players,
          playerHand,
          currentPlayer,
          currentCard,
          game,
          mediator,
          stateManager,
        })
      )}
    </main>
  );
}
