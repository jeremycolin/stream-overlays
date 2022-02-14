import { EventTypesEnum } from "api";
import { Socket } from "socket.io";
import { addBroadcasterSubscription, clearBroadCasterSubscriptions } from "../events/broadcast";
import { deleteSubscription, getBroadcasterIdFromUser, getOrSubscribeToType } from "../apis/twitch";

export async function socketMiddleWare(socket: Socket) {
  const user = socket.handshake.query.user as string;
  console.log(`${user} connected`);

  const brodcasterUserId = await getBroadcasterIdFromUser(user);
  if (!brodcasterUserId) {
    console.warn(`${user} not found, disconnecting socket`);
    socket.disconnect();
    return;
  }

  const subscriptions = (
    await Promise.all([
      getOrSubscribeToType(brodcasterUserId, EventTypesEnum.FOLLOW),
      // getOrSubscribeToType(brodcasterUserId, EventTypesEnum.SUBSCRIBE), // needs broadcaster oauth
      // getOrSubscribeToType(brodcasterUserId, EventTypesEnum.GIFT), // needs broadcaster oauth
      // getOrSubscribeToType(brodcasterUserId, EventTypesEnum.RAID), // works but useless for now
    ])
  ).flat();

  console.log("brodcasterUserId: ", brodcasterUserId);
  addBroadcasterSubscription(brodcasterUserId, (event) => {
    console.log("EMITTING: ,", event);
    socket.emit(event.type, event);
  });

  socket.on("disconnect", () => {
    clearBroadCasterSubscriptions(brodcasterUserId);

    subscriptions.forEach((sub) => deleteSubscription(sub.id));
    console.log(`${user} disconnected`);
  });
}
