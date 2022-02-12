import crypto from "crypto";
import { NextFunction, Request, Response } from "express";
import { broadcastEvent } from "../broadcast";
import { TwitchNotification } from "../events/twitch";

// Notification request headers
const TWITCH_MESSAGE_ID = "Twitch-Eventsub-Message-Id".toLowerCase();
const TWITCH_MESSAGE_TIMESTAMP = "Twitch-Eventsub-Message-Timestamp".toLowerCase();
const TWITCH_MESSAGE_SIGNATURE = "Twitch-Eventsub-Message-Signature".toLowerCase();
const MESSAGE_TYPE = "Twitch-Eventsub-Message-Type".toLowerCase();

// Notification message types
const MESSAGE_TYPE_VERIFICATION = "webhook_callback_verification";
const MESSAGE_TYPE_NOTIFICATION = "notification";
const MESSAGE_TYPE_REVOCATION = "revocation";

const HMAC_PREFIX = "sha256=";

function getSecret() {
  // TODO: Get secret from secure storage. This is the secret you pass
  // when you subscribed to the event.
  return process.env.TWITCH_CLIENT_SECRET!;
}

// Get the HMAC.
function getHmac(secret: string, message: string) {
  return crypto.createHmac("sha256", secret).update(message).digest("hex");
}

// Verify whether our hash matches the hash that Twitch passed in the header.
function verifyMessage(hmac: string, verifySignature: string) {
  return crypto.timingSafeEqual(Buffer.from(hmac), Buffer.from(verifySignature));
}

// Build the message used to get the HMAC.
function getHmacMessage(request: Request) {
  return `${request.headers[TWITCH_MESSAGE_ID]}${request.headers[TWITCH_MESSAGE_TIMESTAMP]}${request.body}`;
}

export function twitchEventSubValidationMiddleWare(req: Request, res: Response, next: NextFunction) {
  const secret = getSecret();
  const message = getHmacMessage(req);
  const hmac = `${HMAC_PREFIX}${getHmac(secret, message)}`; // Signature to compare

  if (verifyMessage(hmac, req.headers[TWITCH_MESSAGE_SIGNATURE] as string)) {
    const notification: TwitchNotification = JSON.parse(req.body);
    res.locals.notification = notification;
    next();
  } else {
    res.sendStatus(403);
    console.error("Message signature did not match hmac secret");
  }
}

export function twitchEventSubMessageTypeMiddleWare(req: Request, res: Response, next: NextFunction) {
  const notification: TwitchNotification = res.locals.notification;

  if (MESSAGE_TYPE_VERIFICATION === req.headers[MESSAGE_TYPE]) {
    res.status(200).send(notification.challenge);
  } else if (MESSAGE_TYPE_REVOCATION === req.headers[MESSAGE_TYPE]) {
    res.sendStatus(204);
    console.warn(`${notification.subscription.type} notifications revoked!`);
    console.warn(`reason: ${notification.subscription.status}`);
    console.warn(`condition: ${JSON.stringify(notification.subscription.condition, null, 4)}`);
  } else if (MESSAGE_TYPE_NOTIFICATION === req.headers[MESSAGE_TYPE]) {
    notification.event.broadcaster_user_id = "151809327"; // as we use twitch CLI for now, force a given user (samyz_)
    console.log("handling notification: ", notification);
    broadcastEvent(notification);
    res.sendStatus(204);
  } else {
    res.sendStatus(204);
    console.warn(`Unknown message type: ${req.headers[MESSAGE_TYPE]}`);
  }
}
