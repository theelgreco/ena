"use client";
import { Button } from "@mui/material";
import PlayerAvatar from "./PlayerAvatar";
import ColourPopup from "./ColourPopup";

import styles from "../app/cardStyles.module.css";

export default function GameRoom({ player, playerHand, game, mediator, currentPlayer, currentCard, stateManager }) {
  mediator.stateManager.registerGameState();

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

  function handleDraw() {
    if (currentPlayer !== mediator.playerIndex) return;
    if (stateManager.hasDrawn) return;
    player.drawCard();
  }

  function handlePass() {
    if (currentPlayer !== mediator.playerIndex) return;
    player.passTurn();
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

  return (
    <section className="w-full h-[100svh]">
      {mediator.orderOfPlayers.length === game.capacity ? (
        // outer layer
        <div className="flex flex-col flex-nowrap w-full h-full">
          {/* other players */}
          <div className="flex flex-col flex-nowrap w-full max-w-full justify-center">
            {/* top player */}
            <div className="flex flex-row flex-nowrap w-full max-w-full justify-center items-center mb-auto mt-3">
              <PlayerAvatar username={mediator.orderOfPlayers[2].username} active={currentPlayer === (mediator.playerIndex + 2) % game.capacity} />
            </div>
            {/* middle section */}
            <div className="flex flex-row mt-10 w-full max-w-full justify-between items-center">
              {/* left player */}
              <div className="flex flex-col flex-nowrap justify-center items-center">
                <PlayerAvatar username={mediator.orderOfPlayers[1].username} active={currentPlayer === (mediator.playerIndex + 1) % game.capacity} />
              </div>
              {/* right player */}
              <div className="flex flex-col flex-nowrap justify-center items-center">
                <PlayerAvatar username={mediator.orderOfPlayers[3].username} active={currentPlayer === (mediator.playerIndex + 3) % game.capacity} />
              </div>
            </div>
          </div>
          {/* draw pile and current card */}
          <div className="flex flex-col flex-nowrap m-auto">
            <div className="flex flex-row flex-nowrap flex-grow w-full max-w-full justify-center gap-6">
              <img
                className="h-[150px] select-none cursor-pointer"
                src="https://firebasestorage.googleapis.com/v0/b/ena-game-6b545.appspot.com/o/cards%2Fback.svg?alt=media&token=92224126-eaf1-46c7-a5f3-ea468502858b"
                onClick={handleDraw}
                style={{ WebkitUserDrag: "none" }}
              />
              <img
                className="h-[150px] select-none cursor-pointer"
                style={currentCard.value === "+4" || currentCard.value === "wild" ? { outline: `${currentCard.colour} 8px solid`, padding: "2px", borderRadius: "10px" } : {}}
                src={currentCard ? currentCard.imagePath : ""}
                onClick={handleTakeTurn}
              />
            </div>
          </div>
          {/* bottom player (you) */}
          <div className="flex flex-col flex-nowrap items-center w-full max-w-full mt-auto">
            <div className="flex flex-row flex-wrap flex-grow w-full max-w-full justify-center translate-x-[-8.5px] mb-6">
              {playerHand.map((card, index) => {
                return (
                  <img
                    key={`${card.id}`}
                    id={index}
                    className="h-[100px] select-none mr-[-17px]"
                    style={{ zIndex: index + 1, WebkitUserDrag: "none" }}
                    src={card.imagePath}
                    onClick={handleCardClick}
                  />
                );
              })}
            </div>
            <div className="flex flex-row flex-nowrap gap-2 h-[75px] w-full max-w-[700px] justify-center mb-2">
              {currentPlayer === mediator.playerIndex ? (
                <>
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
                </>
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
      <ColourPopup onClose={handleClose} selectedValue={stateManager.selectedValue} open={stateManager.colourChoiceOpen} />
    </section>
  );
}
