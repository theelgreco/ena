import { useState, useEffect } from "react";

import { Button } from "@mui/material";

import Progress from "../Progress/Progress";
import ColourPopup from "../ColourPopup/ColourPopup";

import styles from "./PlayerControls.module.css";

export default function PlayerControls({ player, mediator, stateManager, playerHand, currentPlayer }) {
  const [timeUp, setTimeUp] = useState(false);

  useEffect(() => {
    if (timeUp) {
      handleTimeUp();
    }
  }, [timeUp]);

  function handleCardClick(e) {
    if (currentPlayer !== mediator.playerIndex) return;

    const cardIndex = Number(e.target.id);
    player.handleCardSelection(cardIndex);
    e.target.classList.toggle(styles["card-selected"]);
  }

  async function handleTakeTurn(e, colour) {
    if (currentPlayer !== mediator.playerIndex) return;
    if (!mediator.validateTurn()) return;

    const playerSelections = mediator.player.selected;
    const lastSelection = playerSelections[playerSelections.length - 1];
    const lastCard = mediator.game.players[mediator.playerIndex].hand[lastSelection];

    if (colour) {
      mediator.game.players[mediator.playerIndex].hand[lastSelection].colour = colour;
    }

    if (lastCard.colour === "black") {
      handleClickOpen();
    } else {
      player.playTurn();
    }
  }

  async function handleDraw() {
    // if (currentPlayer !== mediator.playerIndex) return;
    // if (stateManager.hasDrawn) return;
    await player.drawCard();
  }

  async function handlePass() {
    // if (currentPlayer !== mediator.playerIndex) return;
    await player.passTurn();
  }

  const handleClickOpen = () => {
    stateManager.setColourChoiceOpen(true);
  };

  const handleClose = (value) => {
    stateManager.setColourChoiceOpen(false);

    if (value) {
      handleTakeTurn(undefined, value);
    }
  };

  async function handleTimeUp() {
    await handleDraw();
    await handlePass();
  }

  return (
    <>
      <div className="flex flex-col flex-nowrap items-center w-full max-w-full mt-auto gap-3">
        <div className="flex flex-row flex-grow w-full max-w-full justify-center translate-x-[-8.5px] mb-6 ml-[-1.5rem]">
          {playerHand.map((card, index) => {
            return (
              <img
                key={`${card.id}`}
                id={index}
                className={"h-[100px] select-none " + `mr-[-3rem]`}
                style={{ zIndex: index + 1, WebkitUserDrag: "none" }}
                src={card.imagePath}
                onClick={handleCardClick}
              />
            );
          })}
        </div>
        {currentPlayer === mediator.playerIndex && (
          <div className="flex flex-col flex-nowrap gap-4 w-full max-w-[700px] items-center">
            <Progress startingProgress={100} totalTime={30} width={"98%"} height={"20px"} setTimeUp={setTimeUp} handleTimeUp={handleTimeUp} />
            <div className="flex flex-row flex-nowrap gap-2 h-[75px] w-full justify-center mb-2">
              <Button
                variant="contained"
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-lg h-full w-[30%] flex-grow"
                onClick={handleTakeTurn}
                disabled={!stateManager.hasSelected}
              >
                Play
              </Button>
              <Button
                variant="contained"
                className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-4 px-8 rounded-lg h-full w-[30%] flex-grow"
                onClick={handleDraw}
                disabled={stateManager.hasDrawn}
              >
                Draw
              </Button>
              <Button
                variant="contained"
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-4 px-8 rounded-lg h-full w-[30%] flex-grow"
                onClick={handlePass}
                disabled={!stateManager.hasDrawn}
              >
                Pass
              </Button>
            </div>
          </div>
        )}
      </div>
      <ColourPopup onClose={handleClose} selectedValue={stateManager.selectedValue} open={stateManager.colourChoiceOpen} />
    </>
  );
}
