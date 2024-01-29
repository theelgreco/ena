import clsx from "clsx";

export default function PlayerAvatar({ username, active, joined }) {
  return (
    <div className={clsx("player-icon", joined && "joined")}>
      {joined ? (
        <div className="flex flex-col flex-nowrap">
          <img src="/images/Zoe.png" />
          <div className="name-bar cartoon-text">
            <p>{username}</p>
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
