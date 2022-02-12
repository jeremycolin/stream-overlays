import "dotenv/config";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import compression from "compression";
import helmet from "helmet";
import { config, isDev } from "./config";
import { twitchEventSubMessageTypeMiddleWare, twitchEventSubValidationMiddleWare } from "./middleware/twitch-eventsub";
import { socketMiddleWare } from "./middleware/socket";
import "./health";

const app = express();

app.use(compression());
app.use(helmet());
app.use(
  express.raw({
    // we need the raw message body for signature verification
    type: "application/json",
  })
);
app.get("/hello", (req, res) => {
  res.status(200).send("Hello World");
});
app.post("/eventsub", [twitchEventSubValidationMiddleWare, twitchEventSubMessageTypeMiddleWare]);

const server = createServer(app);
const io = new Server(
  server,
  isDev
    ? {
        cors: {
          origin: "http://localhost:5000",
        },
      }
    : {}
);

io.on("connection", socketMiddleWare);

server.listen(config.SERVER_PORT, () => {
  console.log(`server listening at http://localhost:${config.SERVER_PORT}`);
});
