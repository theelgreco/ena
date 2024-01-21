"use client";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import { Game } from "@/objects/game";
import React, { useEffect, useState } from "react";
import clsx from "clsx";

import JoinGame from "@/components/JoinGame";
import WaitingRoom from "@/components/WaitingRoom";
import GameRoom from "@/components/GameRoom";

const componentLookup = {
  waiting: WaitingRoom,
  playing: GameRoom,
};

export default function Home() {
  const [username, setUsername] = useState(null);
  const [game, setGame] = useState(null);

  useEffect(() => {
    if (game) {
      console.log(game);
    }
  }, [game]);

  return (
    <main className="flex flex-col items-center justify-center min-w-full min-h-full bg-slate-600 px-3">
      {!game ? (
        <JoinGame
          game={game}
          setGame={setGame}
          username={username}
          setUsername={setUsername}
        />
      ) : (
        React.createElement(componentLookup[game.status], {
          username,
          game,
          setGame,
        })
      )}
    </main>
  );
}
