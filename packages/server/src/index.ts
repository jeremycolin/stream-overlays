import express from "express";
import "dotenv/config";
import "./socket-server";
import { twitchEventSubMessageTypeMiddleWare, twitchEventSubValidationMiddleWare } from "./middleware/twitch-eventsub";
const app = express();
const PORT = 8080;

app.use(
  express.raw({
    // we need the raw message body for signature verification
    type: "application/json",
  })
);

app.use([twitchEventSubValidationMiddleWare, twitchEventSubMessageTypeMiddleWare]);

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
