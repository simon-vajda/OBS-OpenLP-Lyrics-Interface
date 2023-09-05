const channel = new BroadcastChannel("obs_openlp_control_channel");

try {
  const socket = io("http://localhost:5000");

  socket.on("displayNext", (lineCount) => {
    const payload = {
      type: "displayNext",
      value: lineCount,
    };
    channel.postMessage(JSON.stringify(payload));
  });

  socket.on("undoDisplay", () => {
    const payload = {
      type: "undoDisplay",
    };
    channel.postMessage(JSON.stringify(payload));
  });

  socket.on("redoDisplay", () => {
    const payload = {
      type: "redoDisplay",
    };
    channel.postMessage(JSON.stringify(payload));
  });

  socket.on("nextSlide", () => {
    const payload = {
      type: "nextSlide",
    };
    channel.postMessage(JSON.stringify(payload));
  });

  socket.on("prevSlide", () => {
    const payload = {
      type: "prevSlide",
    };
    channel.postMessage(JSON.stringify(payload));
  });
} catch (e) {
  alert(
    "Nem sikerült csatlakozni a távirányító szerverhez. Ellenőrizd, hogy fut-e a szerver, majd frissítsd az oldalt!"
  );
}
