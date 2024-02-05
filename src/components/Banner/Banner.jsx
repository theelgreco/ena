export default function Banner({ game, players }) {
  return (
    <div className="main-button text-center banner cartoon-text p-0 text-nowrap">
      <h1 className="text-7xl text-white">{game.code}</h1>
      <small className="mb-2 text-slate-200">
        {players.length}/{game.capacity} players joined
      </small>
    </div>
  );
}
