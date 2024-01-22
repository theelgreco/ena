import { Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function WaitingRoom({ player, game, mediator }) {
  return (
    <section className="w-full h-[100svh]">
      <div className="flex flex-col flex-nowrap items-center gap-3 px-6 py-5 bg-slate-600 rounded-2xl h-full">
        <div className="flex w-full">
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
        </div>
        <div className="max-w-[900px] w-full flex flex-col flex-grow flex-nowrap items-center gap-3">
          <h1 className="text-7xl text-slate-300">{game.code}</h1>
          <small className="text-slate-100 mb-2">
            {game.players.length}/{game.capacity} players joined
          </small>
          <div className="flex flex-wrap w-full flex-grow bg-slate-700 rounded-2xl mb-3 shadow-lg shadow-slate-800 p-6 gap-3 justify-between">
            {game.players.map((player, index) => {
              return (
                <div className="w-[45%] h-[40%] bg-slate-800 rounded-2xl grid place-items-center" key={`${player.username}_${index}`}>
                  <p className="text-5xl font-bold">{player.username}</p>
                </div>
              );
            })}
          </div>
          <div className="bg-slate-700 p-5 w-full flex justify-center rounded-2xl shadow-lg shadow-slate-800">
            <p className="posting text-slate-300">{game.players.length < game.capacity ? "Waiting for more players to join" : "Starting game"}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
