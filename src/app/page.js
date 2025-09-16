"use client";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import React, { useEffect, useState } from "react";
import HomeScreen from "@/components/HomeScreen/HomeScreen";
import WaitingRoom from "@/components/WaitingRoom/WaitingRoom";
import { GameRoom2, GameRoom3, GameRoom4, GameRoom5 } from "@/components/GameRoom/GameRoom";
import Authentication from "@/components/Authentication/Authentication";
import { localStorageUserKey } from "@/firebase/authentication/authentication";

const gameRoomLookup = {
  2: GameRoom2,
  3: GameRoom3,
  4: GameRoom4,
  5: GameRoom5,
};

export default function Home() {
  const [pageVisible, setPageVisible] = useState(true);
  const [user, setUser] = useState(null);
  const [game, setGame] = useState(null);
  const [player, setPlayer] = useState(null);
  const [mediator, setMediator] = useState(null);
  const [stateManager, setStateManager] = useState(null);
  const [players, setPlayers] = useState([]);
  const [status, setStatus] = useState(null);
  const [playerHand, setPlayerHand] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [currentCard, setCurrentCard] = useState(null);

  useEffect(() => {
    if (pageVisible && mediator && game) {
      mediator.getGameStateAfterReturningToTab();
    }
  }, [pageVisible]);

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

  useEffect(() => {
    // Attempt to sign in from localstorage on first load
    const user = localStorage.getItem(localStorageUserKey);

    if (user) {
      setUser(JSON.parse(user));
    }

    const checkDocumentVisibility = () => {
      if (document.hidden) {
        setPageVisible(false);
      } else {
        setPageVisible(true);
      }
    };

    document.addEventListener("visibilitychange", checkDocumentVisibility);

    return () => {
      document.removeEventListener("visibilitychange", checkDocumentVisibility);
    };
  }, []);

  return (
    <main className={"w-full h-full max-w-full max-h-full home-screen-px relative " + (status === "playing" ? "home-screen-py" : "pt-24 home-screen-pb")}>
      <>
        {!user && <Authentication setUser={setUser} />}
        {user && !game && <HomeScreen game={game} setGame={setGame} setPlayer={setPlayer} setMediator={setMediator} setStateManager={setStateManager} user={user} setUser={setUser} />}
        {game && status === "waiting" && <WaitingRoom players={players} game={game} mediator={mediator} />}
        {game &&
          status === "playing" &&
          React.createElement(gameRoomLookup[game.capacity], {
            player,
            playerHand,
            game,
            mediator,
            currentPlayer,
            currentCard,
            stateManager,
          })}
      </>
    </main>
  );
}
