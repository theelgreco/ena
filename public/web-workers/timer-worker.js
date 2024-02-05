let timer;
let tickCount = 0;

onmessage = function (e) {
  if (e.data.command === "start") {
    const { totalTime } = e.data;
    timer = setInterval(() => {
      if (tickCount < totalTime) {
        postMessage({ status: "tick" });
        tickCount++;
      } else {
        postMessage({ status: "timeUp" });
        clearInterval(timer);
      }
    }, 1000);
  }
};
