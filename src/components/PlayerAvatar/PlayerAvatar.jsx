import styles from "./PlayerAvatar.module.css";

export default function PlayerAvatar({ username, photoURL }) {
  return (
    <>
      {username ? (
        <div className={`${styles["player-icon"]} ${styles.joined}`}>
          <div className="flex flex-col flex-nowrap">
            <img src={photoURL} />
            <div className={`${styles["name-bar"]} cartoon-text`}>
              <p>{username}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className={`${styles["player-icon"]} ${styles.empty}`}></div>
      )}
    </>
  );
}
