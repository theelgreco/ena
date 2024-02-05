import { Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Banner from "../Banner/Banner";
import PlayerAvatar from "../PlayerAvatar/PlayerAvatar";

export default function WaitingRoom({ players, game, mediator }) {
  const numPlayers = Array.from({ length: game.capacity });

  async function handleLeave() {
    await mediator.leaveGame();
  }

  return (
    <section className="w-full h-full dropped-section">
      <div className="flex flex-col flex-nowrap items-center justify-start w-full h-full">
        {/* <div className="flex w-full">
          <Button
            variant="enclosed"
            startIcon={<ArrowBackIcon />}
            className="bg-slate-700 hover:bg-slate-500 text-slate-300 font-bold p-3 rounded"
            onClick={() => {
              mediator.leaveGame();
            }}
          >
            Home
          </Button>
        </div> */}
        {/* <div className="max-w-[900px] w-full flex flex-col flex-grow flex-nowrap items-center gap-3"> */}
        <div className="banner-container">
          <Banner game={game} players={players} />
        </div>
        <button onClick={handleLeave} className="leave-button cartoon-text">
          Leave
        </button>
        <div className="flex flex-row flex-wrap justify-center items-center w-full h-full overflow-y-auto scrollbar-none">
          {numPlayers.map((place, index) => {
            return players[index] ? (
              <div key={index} className="min-w-[30%] mx-6 my-6 grid place-items-center">
                <PlayerAvatar username={players[index].username} photoURL={players[index].photoURL} joined={true} />
              </div>
            ) : (
              <div key={index} className="min-w-[30%] mx-6 my-6 grid place-items-center">
                <PlayerAvatar joined={false} />
              </div>
            );
          })}
        </div>
      </div>
      {/* <div className="bg-slate-700 p-5 w-full flex justify-center rounded-2xl shadow-lg shadow-slate-800">
          <p className="posting text-slate-300">{players.length < game.capacity ? "Waiting for more players to join" : "Starting game"}</p>
        </div> */}
      {/* </div> */}
    </section>
  );
}
