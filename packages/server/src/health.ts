const TWITCH_API_TOKEN = process.env.TWITCH_API_TOKEN;
const TWITCH_CLIENT_ID = process.env.TWITCH_CLIENT_ID;
const TWITCH_CLIENT_SECRET = process.env.TWITCH_CLIENT_SECRET;

if (!TWITCH_API_TOKEN) {
  throw Error("ENV variable TWITCH_API_TOKEN missing");
}
if (!TWITCH_CLIENT_ID) {
  throw Error("ENV variable TWITCH_CLIENT_ID missing");
}
if (!TWITCH_CLIENT_SECRET) {
  throw Error("ENV variable TWITCH_CLIENT_SECRET missing");
}
