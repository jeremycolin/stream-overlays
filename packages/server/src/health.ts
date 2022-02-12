import { isDev } from "./config";

if (!process.env.TWITCH_API_TOKEN) {
  throw Error("ENV variable TWITCH_API_TOKEN missing");
}
if (!process.env.TWITCH_CLIENT_ID) {
  throw Error("ENV variable TWITCH_CLIENT_ID missing");
}
if (!process.env.TWITCH_CLIENT_SECRET) {
  throw Error("ENV variable TWITCH_CLIENT_SECRET missing");
}

if (!isDev) {
  if (!process.env.PORT) {
    throw Error("ENV variable PORT missing");
  }
}
