import { EventTypesEnum, SubscriptionEvent } from "api";
import { TwitchSubscription } from "../apis/twitch";
import {
  isTwitchFollowEvent,
  isTwitchGiftEvent,
  isTwitchRaidEvent,
  isTwitchSubEvent,
  TwitchEvent,
  TwitchNotificationSubscription,
} from "./twitch";

type Subscription = (event: SubscriptionEvent) => void;
const broadcasterMap = new Map<string, { twitchSubscriptions: TwitchSubscription[]; subscription: Subscription }>();

export function setBroadcasterSubscriptions(
  broadcasterUserId: string,
  twitchSubscriptions: TwitchSubscription[],
  subscription: Subscription
) {
  broadcasterMap.set(broadcasterUserId, { twitchSubscriptions, subscription });
}

export function getBroadcasterSubscriptions(broadcasterUserId: string) {
  return broadcasterMap.get(broadcasterUserId);
}

export function cleanBroadCasterSubscriptions(broadcasterUserId: string) {
  broadcasterMap.delete(broadcasterUserId);
}

export function broadcastEvent({ event, subscription }: { event: TwitchEvent; subscription: TwitchNotificationSubscription }) {
  const subscriptions = broadcasterMap.get(event.broadcaster_user_id);
  if (!subscriptions) {
    console.warn("Broadcaster", event.broadcaster_user_id, "has no active broadcast subscriptions");
    return;
  }

  let broadcastEvent: SubscriptionEvent;
  if (isTwitchFollowEvent(event, subscription.type)) {
    broadcastEvent = {
      type: EventTypesEnum.FOLLOW,
      timestamp: subscription.created_at,
      user_name: event.user_name,
    };
  } else if (isTwitchSubEvent(event, subscription.type)) {
    broadcastEvent = {
      type: EventTypesEnum.SUBSCRIBE,
      timestamp: subscription.created_at,
      user_name: event.user_name,
      tier: event.tier,
      is_gift: event.is_gift,
    };
  } else if (isTwitchGiftEvent(event, subscription.type)) {
    broadcastEvent = {
      type: EventTypesEnum.GIFT,
      timestamp: subscription.created_at,
      user_name: event.user_name,
      tier: event.tier,
      total: event.total,
      cumulative_total: event.cumulative_total,
      is_anonymous: event.is_anonymous,
    };
  } else if (isTwitchRaidEvent(event, subscription.type)) {
    broadcastEvent = {
      type: EventTypesEnum.RAID,
      timestamp: subscription.created_at,
      from_user_name: event.from_broadcaster_user_name,
      viewers: event.viewers,
    };
  } else {
    console.warn("unknown event: ", subscription.type);
    return;
  }

  subscriptions.subscription(broadcastEvent);
}
