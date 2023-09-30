export const EventTypes = Object.freeze({
  INFO: "channel.info",
  FOLLOW: "channel.follow",
  SUBSCRIBE: "channel.subscribe",
  GIFT: "channel.subscription.gift",
  RAID: "channel.raid",
});

export const enum EventTypesEnum {
  INFO = "channel.info",
  FOLLOW = "channel.follow",
  SUBSCRIBE = "channel.subscribe",
  GIFT = "channel.subscription.gift",
  RAID = "channel.raid",
}

export const OauthTypes = Object.freeze({
  OAUTH_START: "oauth.start",
  OAUTH_SUCCESS: "oauth.success",
});

export const enum OauthTypesEnum {
  OAUTH_START = "oauth.start",
  OAUTH_SUCCESS = "oauth.success",
}

export interface InfoEvent {
  type: EventTypesEnum.INFO;
  game_name: string;
}

export interface FollowEvent {
  type: EventTypesEnum.FOLLOW;
  user_name: string;
  timestamp: string;
  description: string;
  display_name: string;
  profile_image_url: string;
}

export interface SubEvent {
  type: EventTypesEnum.SUBSCRIBE;
  timestamp: string;
  user_name: string;
  tier: string;
  is_gift: boolean;
}

export interface GiftEvent {
  type: EventTypesEnum.GIFT;
  timestamp: string;
  user_name: string | null;
  total: number;
  tier: string;
  cumulative_total: number | null;
  is_anonymous: boolean;
}

export interface RaidEvent {
  type: EventTypesEnum.RAID;
  timestamp: string;
  from_user_name: string;
  viewers: number;
}

export type SubscriptionEvent = InfoEvent | FollowEvent | SubEvent | GiftEvent | RaidEvent;

export { TWITCH_GAMES } from "./twitch-games";
