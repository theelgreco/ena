"use client";
import GameAvatar from "../GameAvatar/GameAvatar";
import PlayerControls from "../PlayerControls/PlayerControls";

export function GameRoom2({ player, playerHand, game, mediator, currentPlayer, currentCard, stateManager }) {
  mediator.stateManager.registerGameState();

  return (
    <section className="w-full h-full dropped-section">
      {mediator.orderOfPlayers.length === game.capacity && (
        // outer layer
        <div className="flex flex-col flex-nowrap w-full h-full">
          {/* other players */}
          <div className="flex flex-col flex-nowrap w-full max-w-full justify-center">
            <div className="flex flex-row flex-nowrap w-full max-w-full justify-center items-center mb-auto mt-3">
              {/* top player */}
              <GameAvatar
                username={mediator.orderOfPlayers[1].username}
                photoURL={mediator.orderOfPlayers[1].photoURL}
                active={currentPlayer === (mediator.playerIndex + 1) % game.capacity}
                cardsLeft={game.players[(mediator.playerIndex + 1) % game.capacity].hand.length}
              />
            </div>
          </div>
          {/* draw pile and current card */}
          <div className="flex flex-col flex-nowrap m-auto">
            <div className="flex flex-row flex-nowrap flex-grow w-full max-w-full justify-center gap-6">
              <img
                className="h-[150px] select-none cursor-pointer"
                src="https://firebasestorage.googleapis.com/v0/b/ena-game-6b545.appspot.com/o/cards%2Fback.svg?alt=media&token=92224126-eaf1-46c7-a5f3-ea468502858b"
                // onClick={handleDraw}
                style={{ WebkitUserDrag: "none" }}
              />
              <img
                className="h-[150px] select-none cursor-pointer"
                style={currentCard.value === "+4" || currentCard.value === "wild" ? { outline: `${currentCard.colour} 8px solid`, padding: "2px", borderRadius: "10px" } : {}}
                src={currentCard ? currentCard.imagePath : ""}
                // onClick={handleTakeTurn}
              />
            </div>
          </div>
          {/* bottom player (you) */}
          <PlayerControls player={player} mediator={mediator} stateManager={stateManager} playerHand={playerHand} currentPlayer={currentPlayer} />
        </div>
      )}
    </section>
  );
}

export function GameRoom3({ player, playerHand, game, mediator, currentPlayer, currentCard, stateManager }) {
  mediator.stateManager.registerGameState();

  return (
    <section className="w-full h-full dropped-section">
      {mediator.orderOfPlayers.length === game.capacity && (
        // outer layer
        <div className="flex flex-col flex-nowrap w-full h-full">
          {/* other players */}
          <div className="flex flex-col flex-nowrap w-full max-w-full justify-center">
            <div className="flex flex-row flex-nowrap w-full max-w-full justify-center items-center mb-auto mt-3">
              {/* top players */}
              <GameAvatar
                username={mediator.orderOfPlayers[1].username}
                photoURL={mediator.orderOfPlayers[1].photoURL}
                active={currentPlayer === (mediator.playerIndex + 1) % game.capacity}
                cardsLeft={game.players[(mediator.playerIndex + 1) % game.capacity].hand.length}
              />
              <GameAvatar
                username={mediator.orderOfPlayers[2].username}
                photoURL={mediator.orderOfPlayers[2].photoURL}
                active={currentPlayer === (mediator.playerIndex + 2) % game.capacity}
                cardsLeft={game.players[(mediator.playerIndex + 2) % game.capacity].hand.length}
              />
            </div>
          </div>
          {/* draw pile and current card */}
          <div className="flex flex-col flex-nowrap m-auto">
            <div className="flex flex-row flex-nowrap flex-grow w-full max-w-full justify-center gap-6">
              <img
                className="h-[150px] select-none cursor-pointer"
                src="https://firebasestorage.googleapis.com/v0/b/ena-game-6b545.appspot.com/o/cards%2Fback.svg?alt=media&token=92224126-eaf1-46c7-a5f3-ea468502858b"
                // onClick={handleDraw}
                style={{ WebkitUserDrag: "none" }}
              />
              <img
                className="h-[150px] select-none cursor-pointer"
                style={currentCard.value === "+4" || currentCard.value === "wild" ? { outline: `${currentCard.colour} 8px solid`, padding: "2px", borderRadius: "10px" } : {}}
                src={currentCard ? currentCard.imagePath : ""}
                // onClick={handleTakeTurn}
              />
            </div>
          </div>
          {/* bottom player (you) */}
          <PlayerControls player={player} mediator={mediator} stateManager={stateManager} playerHand={playerHand} currentPlayer={currentPlayer} />
        </div>
      )}
    </section>
  );
}

export function GameRoom4({ player, playerHand, game, mediator, currentPlayer, currentCard, stateManager }) {
  mediator.stateManager.registerGameState();

  return (
    <section className="w-full h-full dropped-section">
      {mediator.orderOfPlayers.length === game.capacity && (
        // outer layer
        <div className="flex flex-col flex-nowrap w-full h-full">
          {/* other players */}
          <div className="flex flex-col flex-nowrap w-full max-w-full justify-center">
            <div className="flex flex-row flex-nowrap w-full max-w-full justify-center items-center mb-auto mt-3">
              {/* top player */}
              <GameAvatar
                username={mediator.orderOfPlayers[2].username}
                photoURL={mediator.orderOfPlayers[2].photoURL}
                active={currentPlayer === (mediator.playerIndex + 2) % game.capacity}
                cardsLeft={game.players[(mediator.playerIndex + 2) % game.capacity].hand.length}
              />
            </div>
            {/* middle section */}
            <div className="flex flex-row mt-10 w-full max-w-full justify-between items-center">
              {/* left player */}
              <GameAvatar
                username={mediator.orderOfPlayers[1].username}
                photoURL={mediator.orderOfPlayers[1].photoURL}
                active={currentPlayer === (mediator.playerIndex + 1) % game.capacity}
                cardsLeft={game.players[(mediator.playerIndex + 1) % game.capacity].hand.length}
              />
              {/* right player */}
              <GameAvatar
                username={mediator.orderOfPlayers[3].username}
                photoURL={mediator.orderOfPlayers[3].photoURL}
                active={currentPlayer === (mediator.playerIndex + 3) % game.capacity}
                cardsLeft={game.players[(mediator.playerIndex + 3) % game.capacity].hand.length}
              />
            </div>
          </div>
          {/* draw pile and current card */}
          <div className="flex flex-col flex-nowrap m-auto">
            <div className="flex flex-row flex-nowrap flex-grow w-full max-w-full justify-center gap-6">
              <img
                className="h-[150px] select-none cursor-pointer"
                src="https://firebasestorage.googleapis.com/v0/b/ena-game-6b545.appspot.com/o/cards%2Fback.svg?alt=media&token=92224126-eaf1-46c7-a5f3-ea468502858b"
                // onClick={handleDraw}
                style={{ WebkitUserDrag: "none" }}
              />
              <img
                className="h-[150px] select-none cursor-pointer"
                style={currentCard.value === "+4" || currentCard.value === "wild" ? { outline: `${currentCard.colour} 8px solid`, padding: "2px", borderRadius: "10px" } : {}}
                src={currentCard ? currentCard.imagePath : ""}
                // onClick={handleTakeTurn}
              />
            </div>
          </div>
          {/* bottom player (you) */}
          <PlayerControls player={player} mediator={mediator} stateManager={stateManager} playerHand={playerHand} currentPlayer={currentPlayer} />
        </div>
      )}
    </section>
  );
}

export function GameRoom5({ player, playerHand, game, mediator, currentPlayer, currentCard, stateManager }) {
  mediator.stateManager.registerGameState();

  return (
    <section className="w-full h-full dropped-section">
      {mediator.orderOfPlayers.length === game.capacity && (
        // outer layer
        <div className="flex flex-col flex-nowrap w-full h-full">
          {/* other players */}
          <div className="flex flex-col flex-nowrap w-full max-w-full justify-center">
            <div className="flex flex-row flex-nowrap w-full max-w-full justify-evenly items-center mb-auto mt-3">
              {/* top left player */}
              <GameAvatar
                username={mediator.orderOfPlayers[2].username}
                photoURL={mediator.orderOfPlayers[2].photoURL}
                active={currentPlayer === (mediator.playerIndex + 2) % game.capacity}
                cardsLeft={game.players[(mediator.playerIndex + 2) % game.capacity].hand.length}
                extraStyles={{ margin: 0 }}
              />
              {/* top right player */}
              <GameAvatar
                username={mediator.orderOfPlayers[3].username}
                photoURL={mediator.orderOfPlayers[3].photoURL}
                active={currentPlayer === (mediator.playerIndex + 3) % game.capacity}
                cardsLeft={game.players[(mediator.playerIndex + 3) % game.capacity].hand.length}
                extraStyles={{ margin: 0 }}
              />
            </div>
            {/* middle section */}
            <div className="flex flex-row mt-10 w-full max-w-full justify-between items-center">
              {/* left player */}
              <GameAvatar
                username={mediator.orderOfPlayers[1].username}
                photoURL={mediator.orderOfPlayers[1].photoURL}
                active={currentPlayer === (mediator.playerIndex + 1) % game.capacity}
                cardsLeft={game.players[(mediator.playerIndex + 1) % game.capacity].hand.length}
                extraStyles={{ margin: 0 }}
              />
              {/* right player */}
              <GameAvatar
                username={mediator.orderOfPlayers[4].username}
                photoURL={mediator.orderOfPlayers[4].photoURL}
                active={currentPlayer === (mediator.playerIndex + 4) % game.capacity}
                cardsLeft={game.players[(mediator.playerIndex + 4) % game.capacity].hand.length}
                extraStyles={{ margin: 0 }}
              />
            </div>
          </div>
          {/* draw pile and current card */}
          <div className="flex flex-col flex-nowrap m-auto">
            <div className="flex flex-row flex-nowrap flex-grow w-full max-w-full justify-center gap-6">
              <img
                className="h-[150px] select-none cursor-pointer"
                src="https://firebasestorage.googleapis.com/v0/b/ena-game-6b545.appspot.com/o/cards%2Fback.svg?alt=media&token=92224126-eaf1-46c7-a5f3-ea468502858b"
                // onClick={handleDraw}
                style={{ WebkitUserDrag: "none" }}
              />
              <img
                className="h-[150px] select-none cursor-pointer"
                style={currentCard.value === "+4" || currentCard.value === "wild" ? { outline: `${currentCard.colour} 8px solid`, padding: "2px", borderRadius: "10px" } : {}}
                src={currentCard ? currentCard.imagePath : ""}
                // onClick={handleTakeTurn}
              />
            </div>
          </div>
          {/* bottom player (you) */}
          <PlayerControls player={player} mediator={mediator} stateManager={stateManager} playerHand={playerHand} currentPlayer={currentPlayer} />
        </div>
      )}
    </section>
  );
}
