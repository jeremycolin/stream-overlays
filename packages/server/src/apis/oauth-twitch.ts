import axios from "axios";
import { logError } from "./twitch";

const OAUTH2_TWITCH_ENDPOINT = "https://id.twitch.tv/oauth2/token";
const TWITCH_CLIENT_ID = process.env.TWITCH_CLIENT_ID!;
const TWITCH_CLIENT_SECRET = process.env.TWITCH_CLIENT_SECRET!;

export async function getAccessToken() {
  try {
    const { data } = (await axios.post(
      OAUTH2_TWITCH_ENDPOINT,
      {
        client_id: TWITCH_CLIENT_ID,
        client_secret: TWITCH_CLIENT_SECRET,
        grant_type: "client_credentials",
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )) as { data: { access_token: string; expires_in: number } };
    return data.access_token;
  } catch (err) {
    logError(err);
  }
}
