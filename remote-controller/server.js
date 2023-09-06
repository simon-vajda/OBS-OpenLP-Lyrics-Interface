import express from "express";
import http from "http";
import pino from "pino";
import { Server } from "socket.io";

const PORT = 5000;
const DEFAULT_LINE_COUNT = 2;

export const logger = pino({
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
      translateTime: "SYS:HH:MM:ss",
      ignore: "pid,hostname",
    },
  },
  level: "trace",
});

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

io.on("connection", (socket) => {
  logger.debug("client connected");

  socket.on("disconnect", () => {
    logger.debug("client disconnected");
  });
});

app.get("/displayNext", (req, res) => {
  const lineCount = Number(req.query.lineCount) || DEFAULT_LINE_COUNT;
  io.emit("displayNext", lineCount);
  logger.trace(`displayNext: ${lineCount}`);
  res.send();
});

app.get("/undoDisplay", (req, res) => {
  io.emit("undoDisplay");
  logger.trace("undoDisplay");
  res.send();
});

app.get("/redoDisplay", (req, res) => {
  io.emit("redoDisplay");
  logger.trace("redoDisplay");
  res.send();
});

app.get("/nextSlide", (req, res) => {
  io.emit("nextSlide");
  logger.trace("nextSlide");
  res.send();
});

app.get("/prevSlide", (req, res) => {
  io.emit("prevSlide");
  logger.trace("prevSlide");
  res.send();
});

app.use(express.static("public"));

server.listen(PORT, () => {
  logger.info("Listening on port 5000");
});
