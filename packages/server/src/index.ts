import express from "express";
import compression from "compression";
import helmet from "helmet";
import "dotenv/config";
import { config } from "./config";
import "./health";
import "./socket-server";
import { twitchEventSubMessageTypeMiddleWare, twitchEventSubValidationMiddleWare } from "./middleware/twitch-eventsub";

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

app.listen(config.SERVER_PORT, () => {
  console.log(`server listening at http://localhost:${config.SERVER_PORT}`);
});
