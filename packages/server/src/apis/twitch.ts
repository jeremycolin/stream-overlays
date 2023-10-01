import { EventTypesEnum } from "api";
import axiosModule from "axios";
import { isDev } from "../config";
import { refreshAppAccessToken } from "./oauth-twitch";

let TWITCH_API_TOKEN = process.env.TWITCH_API_TOKEN!;
const TWITCH_CLIENT_ID = process.env.TWITCH_CLIENT_ID!;
const TWITCH_CLIENT_SECRET = process.env.TWITCH_CLIENT_SECRET!;
const DISCORD_HOOK_ID = process.env.DISCORD_HOOK_ID!;

const TWITCH_API_BASE_PATH = "https://api.twitch.tv/helix/";
const SUBSCRIPTION_CALLBACK = "https://stream-overlays-production.up.railway.app/eventsub";
const DISCORD_WEBHOOK_BASE_PATH = "https://discord.com/api/webhooks/";
const DISCORD_BOT_AVATAR_URL =
  "https://static-cdn.jtvnw.net/jtv_user_pictures/7129f22e-ba53-463a-b0cf-fcf712d96189-profile_image-70x70.png";

const axios = axiosModule.create({
  baseURL: TWITCH_API_BASE_PATH,
  headers: {
    Authorization: `Bearer ${TWITCH_API_TOKEN}`,
    "Client-Id": TWITCH_CLIENT_ID,
  },
});

axios.interceptors.response.use(
  (response) => response,
  async function (error) {
    const originalRequest = error.config;
    if (error.response.status === 401) {
      console.log("Twitch access token expired, refreshing");
      const twitchApiToken = await refreshAppAccessToken();
      if (twitchApiToken) {
        // logErrorToDiscord("Twitch access token expired, refreshing token was successful :)");
        console.log("refreshing token was successful :)");
        TWITCH_API_TOKEN = twitchApiToken;
        const bearer = `Bearer ${twitchApiToken}`;
        axios.defaults.headers["Authorization"] = bearer;
        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization: bearer,
        };
        return axios(originalRequest);
      } else {
        logErrorToDiscord("Twitch access token expired, refreshing token failed :(");
      }
    }
    return Promise.reject(error);
  }
);

function logErrorToDiscord(content: string) {
  if (isDev) {
    return;
  }
  const params = {
    username: "Askowbot",
    avatar_url: DISCORD_BOT_AVATAR_URL,
    embeds: [
      {
        title: "Error",
        color: 16711680, // red
        description: content,
        timestamp: new Date(),
      },
    ],
  };

  axios.post(`${DISCORD_WEBHOOK_BASE_PATH}${DISCORD_HOOK_ID}`, params);
}

export function logError(err: any) {
  try {
    console.error(err);
  } catch (unknownErr) {
    console.error("something went really wrong: ", unknownErr);
  }
}

export interface TwitchSubscription {
  id: string;
  status: "webhook_callback_verification_pending" | "webhook_callback_verification_failed";
  type: EventTypesEnum;
  version: "1";
  condition: { broadcaster_user_id: string; to_broadcaster_user_id: string; moderator_user_id: string }; // either one of the other but handling type guard here is annoying
  created_at: string;
  transport: {
    method: "webhook";
    callback: "string";
  };
  cost: number;
}

interface TwitchSubscriptionsReponse {
  data: { total: number; data: Array<TwitchSubscription> };
}

export interface TwitchUser {
  description: string;
  display_name: string;
  id: string;
  login: string; // user login name
  profile_image_url: string;
}

export async function getUserInfo(user: string): Promise<TwitchUser | null> {
  try {
    const { data } = await axios.get(`/users?login=${user}`);
    return data.data[0];
  } catch (err) {
    logError(err);
    return null;
  }
}

export async function getSubscriptionsByType(broadcasterUserId: string, type: EventTypesEnum): Promise<Array<TwitchSubscription>> {
  try {
    const { data } = (await axios.get(`/eventsub/subscriptions`, { params: { type } })) as TwitchSubscriptionsReponse;
    return data.data.filter((sub) =>
      type === EventTypesEnum.RAID
        ? sub.condition.to_broadcaster_user_id === broadcasterUserId
        : sub.condition.broadcaster_user_id === broadcasterUserId
    );
  } catch (err) {
    logError(err);
    return [];
  }
}

export async function subscribeToType(broadcasterUserId: string, type: EventTypesEnum): Promise<Array<TwitchSubscription>> {
  try {
    let version = "1";
    let condition: { broadcaster_user_id?: string; to_broadcaster_user_id?: string; moderator_user_id?: string } = {
      broadcaster_user_id: broadcasterUserId,
    };
    if (type === EventTypesEnum.FOLLOW) {
      version = "2";
      condition = { ...condition, moderator_user_id: broadcasterUserId };
    } else if (type === EventTypesEnum.RAID) {
      condition = { to_broadcaster_user_id: broadcasterUserId };
    }

    const { data } = (await axios.post(
      "/eventsub/subscriptions",
      {
        type,
        version,
        condition,
        transport: { method: "webhook", callback: SUBSCRIPTION_CALLBACK, secret: TWITCH_CLIENT_SECRET },
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )) as TwitchSubscriptionsReponse;
    return data.data;
  } catch (err) {
    logError(err);
    return [];
  }
}

export async function deleteSubscription(id: string): Promise<void> {
  try {
    await axios.delete("/eventsub/subscriptions", { params: { id } });
  } catch (err) {
    logError(err);
  }
}

export async function getOrSubscribeToType(broadcasterUserId: string, type: EventTypesEnum): Promise<Array<TwitchSubscription>> {
  let subscriptions = await getSubscriptionsByType(broadcasterUserId, type);
  if (!subscriptions.length) {
    subscriptions = await subscribeToType(broadcasterUserId, type);
  }
  return subscriptions;
}

export async function getGame(broadcasterUserId: string) {
  try {
    const { data } = await axios.get("/streams", { params: { user_id: broadcasterUserId, first: 1 } });
    if (!data.data.length) {
      return "";
    }
    return data.data[0].game_name;
  } catch (err) {
    logError(err);
    return "";
  }
}
