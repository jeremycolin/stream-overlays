export const EventTypes = Object.freeze({
  FOLLOW: "channel.follow",
  SUBSCRIBE: "channel.subscribe",
  GIFT: "channel.subscription.gift",
  RAID: "channel.raid",
});

export const enum EventTypesEnum {
  FOLLOW = "channel.follow",
  SUBSCRIBE = "channel.subscribe",
  GIFT = "channel.subscription.gift",
  RAID = "channel.raid",
}

export interface FollowEvent {
  type: EventTypesEnum.FOLLOW;
  user_name: string;
  timestamp: string;
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

export type SubscriptionEvent = FollowEvent | SubEvent | GiftEvent | RaidEvent;
