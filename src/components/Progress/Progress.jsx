"use client";
import styles from "./Progress.module.css";
import { useEffect, useState } from "react";
let initialProgress;
let decrementAmount;

export default function Progress({ startingProgress, totalTime, width, height, setTimeUp }) {
  const [progress, setProgress] = useState(startingProgress);

  useEffect(() => {
    if (setTimeUp) {
      setTimeUp(false);
    }

    initialProgress = startingProgress;
    decrementAmount = initialProgress / totalTime;
  }, []);

  // WEB WORKER - fixes issue on laptop but not mobile
  useEffect(() => {
    const gameWorker = new Worker("/web-workers/timer-worker.js");
    gameWorker.postMessage({ command: "start", totalTime });

    gameWorker.onmessage = function (e) {
      const { status } = e.data;
      if (status === "tick") {
        setProgress((prevProgress) => prevProgress - decrementAmount);
      } else if (status === "timeUp" && setTimeUp) {
        console.log("Time's up!");
        setTimeUp(true);
      }
    };

    return () => {
      gameWorker.postMessage({ command: "stop" });
      gameWorker.terminate();
    };
  }, []);

  // useEffect(() => {
  //   if (progress > 0) {
  //     const interval = setInterval(() => {
  //       setProgress((prevProgress) => prevProgress - decrementAmount);
  //     }, 1000);

  //     return () => clearInterval(interval);
  //   } else if (setTimeUp) {
  //     console.log("Time's up!");
  //     setTimeUp(true);
  //   }
  // }, [progress]);

  return (
    <div className={styles["timer-container"]} style={{ width, height }}>
      <div className={styles["timer-outline"]}></div>
      <div
        className={styles["timer-progress"]}
        style={{
          width: `${Math.round(progress)}%`,
          backgroundColor: Math.round(progress) > 50 ? "green" : Math.round(progress) > 20 ? "yellow" : "red",
        }}
      ></div>
    </div>
  );
}
