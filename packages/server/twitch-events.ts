import { EventTypesEnum } from "api";

export interface TwitchNotificationSubscription {
  id: string;
  status: "enabled" | "pending";
  type: EventTypesEnum;
  condition: { broadcaster_user_id: string } | { to_broadcaster_user_id: string };
  created_at: string; //timestamp
}

interface TwitchFollowEvent {
  user_id: string;
  user_login: string;
  user_name: string;
  broadcaster_user_id: string;
  broadcaster_user_login: string;
  broadcaster_user_name: string;
  followed_at: string; // timestamp
}

interface TwitchSubEvent {
  user_id: string;
  user_login: string;
  user_name: string;
  broadcaster_user_id: string;
  broadcaster_user_login: string;
  broadcaster_user_name: string;
  tier: string;
  is_gift: boolean;
}

interface TwitchGiftEvent {
  user_id: string | null;
  user_login: string | null;
  user_name: string | null;
  broadcaster_user_id: string;
  broadcaster_user_login: string;
  broadcaster_user_name: string;
  total: number;
  tier: string;
  cumulative_total: number | null;
  is_anonymous: boolean;
}

interface TwitchRaidEvent {
  to_broadcaster_user_id: string;
  to_broadcaster_user_login: string;
  to_broadcaster_user_name: string;
  from_broadcaster_user_id: string;
  from_broadcaster_user_login: string;
  from_broadcaster_user_name: string;
  viewers: number;
  broadcaster_user_id: string;
}

export type TwitchEvent = TwitchFollowEvent | TwitchSubEvent | TwitchGiftEvent | TwitchRaidEvent;

export interface TwitchNotification {
  event: TwitchEvent;
  subscription: TwitchNotificationSubscription;
  challenge: string;
}

export function isTwitchFollowEvent(event: TwitchEvent, eventType: EventTypesEnum): event is TwitchFollowEvent {
  return eventType === "channel.follow";
}

export function isTwitchSubEvent(event: TwitchEvent, eventType: EventTypesEnum): event is TwitchSubEvent {
  return eventType === "channel.subscribe";
}

export function isTwitchGiftEvent(event: TwitchEvent, eventType: EventTypesEnum): event is TwitchGiftEvent {
  return eventType === "channel.subscription.gift";
}

export function isTwitchRaidEvent(event: TwitchEvent, eventType: EventTypesEnum): event is TwitchRaidEvent {
  return eventType === "channel.raid";
}
