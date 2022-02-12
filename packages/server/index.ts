import "dotenv/config";
import express, { Request } from "express";
import { broadcastEvent } from "./broadcast-events";
import { TwitchNotification } from "./twitch-events";
import "./socket-server";
import { getHmac, getSecret, verifyMessage } from "./twitch-validation-helpers";

const app = express();
const PORT = 8080;

// Notification request headers
const TWITCH_MESSAGE_ID = "Twitch-Eventsub-Message-Id".toLowerCase();
const TWITCH_MESSAGE_TIMESTAMP = "Twitch-Eventsub-Message-Timestamp".toLowerCase();
const TWITCH_MESSAGE_SIGNATURE = "Twitch-Eventsub-Message-Signature".toLowerCase();
const MESSAGE_TYPE = "Twitch-Eventsub-Message-Type".toLowerCase();

// Notification message types
const MESSAGE_TYPE_VERIFICATION = "webhook_callback_verification";
const MESSAGE_TYPE_NOTIFICATION = "notification";
const MESSAGE_TYPE_REVOCATION = "revocation";

// Prepend this string to the HMAC that's created from the message
const HMAC_PREFIX = "sha256=";

app.use(
  express.raw({
    // Need raw message body for signature verification
    type: "application/json",
  })
);

app.post("/", (req, res) => {
  const secret = getSecret();
  const message = getHmacMessage(req);
  const hmac = HMAC_PREFIX + getHmac(secret, message); // Signature to compare

  if (verifyMessage(hmac, req.headers[TWITCH_MESSAGE_SIGNATURE] as string)) {
    const notification: TwitchNotification = JSON.parse(req.body);

    if (MESSAGE_TYPE_NOTIFICATION === req.headers[MESSAGE_TYPE]) {
      notification.event.broadcaster_user_id = "151809327"; // remove Twitch event randomness
      console.log("handling notification: ", notification);

      broadcastEvent(notification);

      res.sendStatus(204);
    } else if (MESSAGE_TYPE_VERIFICATION === req.headers[MESSAGE_TYPE]) {
      res.status(200).send(notification.challenge);
    } else if (MESSAGE_TYPE_REVOCATION === req.headers[MESSAGE_TYPE]) {
      res.sendStatus(204);

      console.log(`${notification.subscription.type} notifications revoked!`);
      console.log(`reason: ${notification.subscription.status}`);
      console.log(`condition: ${JSON.stringify(notification.subscription.condition, null, 4)}`);
    } else {
      res.sendStatus(204);
      console.warn(`Unknown message type: ${req.headers[MESSAGE_TYPE]}`);
    }
  } else {
    console.error("403"); // Signatures didn't match.
    res.sendStatus(403);
  }
});

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});

// Build the message used to get the HMAC.
function getHmacMessage(request: Request) {
  return `${request.headers[TWITCH_MESSAGE_ID]}${request.headers[TWITCH_MESSAGE_TIMESTAMP]}${request.body}`;
}
