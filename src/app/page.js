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

  return (
    <main className="flex flex-col items-center justify-center min-w-full min-h-full bg-slate-600 px-2">
      {!game ? (
        <JoinGame game={game} setGame={setGame} setPlayer={setPlayer} setMediator={setMediator} />
      ) : (
        React.createElement(componentLookup[game.status], {
          player,
          game,
          setGame,
          mediator,
        })
      )}
    </main>
  );
}
