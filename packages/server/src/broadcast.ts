import { EventTypesEnum, SubscriptionEvent } from "api";
import {
  isTwitchFollowEvent,
  isTwitchGiftEvent,
  isTwitchRaidEvent,
  isTwitchSubEvent,
  TwitchEvent,
  TwitchNotificationSubscription,
} from "./events/twitch";

type Subscription = (event: SubscriptionEvent) => void;
const broadcasterMap = new Map<string, Set<Subscription>>();

export function getBroadcasterSubscriptions(broadcasterUserId: string) {
  let broadcastSubscriptions = broadcasterMap.get(broadcasterUserId);
  if (!broadcastSubscriptions) {
    broadcastSubscriptions = new Set();
    broadcasterMap.set(broadcasterUserId, broadcastSubscriptions);
  }
  return broadcastSubscriptions;
}

export function addBroadcasterSubscription(broadcasterUserId: string, subscription: Subscription) {
  const broadcastSubscriptions = getBroadcasterSubscriptions(broadcasterUserId);
  broadcasterMap.set(broadcasterUserId, broadcastSubscriptions.add(subscription));
}

export function clearBroadCasterSubscriptions(broadcasterUserId: string) {
  broadcasterMap.delete(broadcasterUserId);
}

export function broadcastEvent({ event, subscription }: { event: TwitchEvent; subscription: TwitchNotificationSubscription }) {
  const subscriptions = getBroadcasterSubscriptions(event.broadcaster_user_id);

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

  subscriptions.forEach((sub) => sub(broadcastEvent));
}
