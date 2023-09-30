import axiosModule from "axios";
import { logError } from "./twitch";
import { URLSearchParams } from "url";

const TWITCH_OAUTH2_ENDPOINT = "https://id.twitch.tv/oauth2";
const TWITCH_CLIENT_ID = process.env.TWITCH_CLIENT_ID!;
const TWITCH_CLIENT_SECRET = process.env.TWITCH_CLIENT_SECRET!;
const TWITCH_OAUTH_REDIRECT_URL = process.env.TWITCH_OAUTH_REDIRECT_URL!;

const axios = axiosModule.create({
  baseURL: TWITCH_OAUTH2_ENDPOINT,
  headers: {
    "Client-Id": TWITCH_CLIENT_ID,
  },
});

export async function getAccessToken() {
  try {
    const params = new URLSearchParams({
      client_id: TWITCH_CLIENT_ID,
      client_secret: TWITCH_CLIENT_SECRET,
      grant_type: "client_credentials",
    });

    const { data } = (await axios.post("/token", params.toString(), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })) as { data: { access_token: string; expires_in: number } };
    return data.access_token;
  } catch (err) {
    logError(err);
  }
}

export async function getUserOauthTokens({ code }: { code: string }) {
  try {
    const params = new URLSearchParams({
      client_id: TWITCH_CLIENT_ID,
      client_secret: TWITCH_CLIENT_SECRET,
      code,
      grant_type: "authorization_code",
      redirect_uri: TWITCH_OAUTH_REDIRECT_URL,
    });

    const { data } = (await axios.post("/token", params.toString(), {})) as {
      data: { access_token: string; refresh_token: string; expires_in: number };
    };
    return data;
  } catch (err) {
    logError(err);
  }
}

export async function validateUserOauthToken({ access_token }: { access_token: string }) {
  try {
    const { data } = (await axios.get("/validate", {
      headers: {
        Authorization: `OAuth ${access_token}`,
      },
    })) as { data: { user_id: string; scopes: string[] } };
    return data;
  } catch (err) {
    logError(err);
  }
}
