"use client";
import { Button } from "@mui/material";
import PlayerAvatar from "./PlayerAvatar";

import { useEffect, useState } from "react";

import styles from "../app/cardStyles.module.css";

export default function GameRoom({ player, game, mediator }) {
  function handleCardClick(e) {
    if (game.currentPlayer === mediator.playerIndex) {
      const cardIndex = Number(e.target.id);
      player.handleCardSelection(cardIndex);
      e.target.classList.toggle(styles["card-selected"]);
    }
  }

  function handleTakeTurn() {
    player.takeTurn();
  }

  function handleDraw() {
    player.drawCard();
  }

  return (
    <section className="w-full h-[100svh]">
      {mediator.orderOfPlayers.length === game.capacity ? (
        // outer layer
        <div className="flex flex-col flex-nowrap w-full h-full">
          {/* other players */}
          <div className="flex flex-col flex-nowrap w-full max-w-full justify-center">
            {/* top player */}
            <div className="flex flex-row flex-nowrap w-full max-w-full justify-center items-center mb-auto mt-3">
              <PlayerAvatar username={mediator.orderOfPlayers[2].username} active={game.currentPlayer === (mediator.playerIndex + 2) % game.capacity} />
            </div>
            {/* middle section */}
            <div className="flex flex-row mt-10 w-full max-w-full justify-between items-center">
              {/* left player */}
              <div className="flex flex-col flex-nowrap justify-center items-center">
                <PlayerAvatar username={mediator.orderOfPlayers[1].username} active={game.currentPlayer === (mediator.playerIndex + 1) % game.capacity} />
              </div>
              {/* right player */}
              <div className="flex flex-col flex-nowrap justify-center items-center">
                <PlayerAvatar username={mediator.orderOfPlayers[3].username} active={game.currentPlayer === (mediator.playerIndex + 3) % game.capacity} />
              </div>
            </div>
          </div>
          {/* draw pile and current card */}
          <div className="flex flex-col flex-nowrap m-auto">
            <div className="flex flex-row flex-nowrap flex-grow w-full max-w-full justify-center gap-6">
              <img
                className="h-[150px] select-none"
                src="https://firebasestorage.googleapis.com/v0/b/ena-game-6b545.appspot.com/o/cards%2Fback.svg?alt=media&token=92224126-eaf1-46c7-a5f3-ea468502858b"
              />
              <img className="h-[150px] select-none" src={game.currentCard.imagePath} />
            </div>
          </div>
          {/* bottom player (you) */}
          <div className="flex flex-col flex-nowrap items-center w-full max-w-full mt-auto">
            <div className="flex flex-row flex-wrap flex-grow w-full max-w-full justify-center translate-x-[-8.5px] mb-6">
              {player.hand.map((card, index) => {
                return (
                  <img
                    key={`${player.username}_${card.colour}-${card.value}_${index}.${Math.random() * 10000}`}
                    id={index}
                    className="h-[100px] select-none mr-[-17px]"
                    style={{ zIndex: index + 1 }}
                    src={card.imagePath}
                    onClick={handleCardClick}
                  />
                );
              })}
            </div>
            <div className="flex flex-row flex-nowrap gap-2 h-[75px] w-full max-w-[700px] justify-center mb-2">
              <Button variant="contained" className="bg-blue-500 text-white font-bold py-4 px-8 rounded-lg h-full w-[30%] flex-grow" onClick={handleTakeTurn}>
                Play
              </Button>
              <Button variant="contained" className="bg-blue-500 text-white font-bold py-4 px-8 rounded-lg h-full w-[30%] flex-grow" onClick={handleDraw}>
                Draw
              </Button>
              <Button variant="contained" className="bg-blue-500 text-white font-bold py-4 px-8 rounded-lg h-full w-[30%] flex-grow">
                Pass
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </section>
  );
}
