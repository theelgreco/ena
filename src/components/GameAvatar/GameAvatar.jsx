import styles from "./GameAvatar.module.css";
import Progress from "../Progress/Progress";

export default function GameAvatar({ username, photoURL, active, cardsLeft, extraStyles }) {
  return (
    <div className="flex flex-col flex-nowrap items-center gap-4 mx-auto" style={{ ...extraStyles }}>
      <div className={`${styles["game-icon"]}`}>
        <div className="flex flex-col flex-nowrap">
          <img src={photoURL} />
          <div className={`${styles["name-bar"]} cartoon-text`}>
            <p>{username}</p>
          </div>
        </div>
      </div>
      <p className="cartoon-text text-2xl">{cardsLeft}</p>
      {active && <Progress startingProgress={100} totalTime={30} width={"100%"} height={"10px"} />}
    </div>
  );
}
