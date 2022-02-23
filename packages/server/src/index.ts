import "dotenv/config";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import compression from "compression";
import helmet from "helmet";
import { resolve } from "path";
import { config, isDev } from "./config";
import { twitchEventSubMessageTypeMiddleWare, twitchEventSubValidationMiddleWare } from "./middleware/twitch-eventsub";
import { socketMiddleWare } from "./middleware/socket";
import "./health";

const app = express();

app.use(compression());
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        "connect-src": ["'self'", "fonts.googleapis.com", "fonts.gstatic.com"],
        "font-src": ["'self'", "data:", "fonts.gstatic.com"],
        "img-src": ["'self'", "data:", "fonts.gstatic.com", "static-cdn.jtvnw.net"],
        "style-src": ["'self'", "'unsafe-inline'", "fonts.googleapis.com"],
        "script-src": ["'self'", "'unsafe-eval'"], // this is needed by pixi.js https://github.com/pixijs/pixijs/issues/7324,
      },
    },
  })
);

app.use(
  express.raw({
    // we need the raw message body for signature verification
    type: "application/json",
  })
);

app.get("/hello", (req, res) => {
  res.status(200).send("Hello World, yay Heroku!");
});
app.post("/eventsub", [twitchEventSubValidationMiddleWare, twitchEventSubMessageTypeMiddleWare]);

if (!isDev) {
  // in production we also serve static assets through express
  app.use(express.static(config.ASSETS_PATH));
  app.get("*", (req, res) => {
    res.sendFile(resolve(config.ASSETS_PATH, "index.html"));
  });
}

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

io.on("connection", socketMiddleWare(io));

server.listen(config.SERVER_PORT, () => {
  console.log(`server listening at http://localhost:${config.SERVER_PORT}`);
});
