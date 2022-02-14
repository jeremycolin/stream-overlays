import { EventTypesEnum } from "api";
import axiosModule from "axios";

const TWITCH_API_TOKEN = process.env.TWITCH_API_TOKEN!;
const TWITCH_CLIENT_ID = process.env.TWITCH_CLIENT_ID!;
const TWITCH_CLIENT_SECRET = process.env.TWITCH_CLIENT_SECRET!;

const TWITCH_API_BASE_PATH = "https://api.twitch.tv/helix/";
const SUBSCRIPTION_CALLBACK = "https://streamoverlays.herokuapp.com/eventsub";

const axios = axiosModule.create({
  baseURL: TWITCH_API_BASE_PATH,
  headers: {
    Authorization: `Bearer ${TWITCH_API_TOKEN}`,
    "Client-Id": TWITCH_CLIENT_ID,
  },
});

function logError(err: any) {
  try {
    console.error(err.response);
    console.error(err.response.status);
  } catch (unknownErr) {
    console.error("something went really wrong: ", unknownErr);
  }
}

export async function getBroadcasterIdFromUser(user: string): Promise<string | null> {
  try {
    const { data } = await axios.get(`/users?login=${user}`);
    return data.data[0].id;
  } catch (err) {
    logError(err);
    return null;
  }
}

export interface TwitchSubscription {
  id: string;
  status: "webhook_callback_verification_pending" | "webhook_callback_verification_failed";
  type: EventTypesEnum;
  version: "1";
  condition: { broadcaster_user_id: string; to_broadcaster_user_id: string }; // either one of the other but handling type guard here is annoying
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
    const { data } = (await axios.post(
      "/eventsub/subscriptions",
      {
        type,
        version: "1",
        condition:
          type === EventTypesEnum.RAID ? { to_broadcaster_user_id: broadcasterUserId } : { broadcaster_user_id: broadcasterUserId },
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
