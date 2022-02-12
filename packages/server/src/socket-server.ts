import { EventTypesEnum } from "api";
import { createServer } from "http";
import { Server } from "socket.io";
import { addBroadcasterSubscription, clearBroadCasterSubscriptions } from "./events/broadcast";
import { deleteSubscription, getBroadcasterIdFromUser, getOrSubscribeToType } from "./apis/twitch";
import { config, isDev } from "./config";

const httpServer = createServer();
const io = new Server(
  httpServer,
  isDev
    ? {
        cors: {
          origin: "http://localhost:5000",
        },
      }
    : {}
);

httpServer.listen(config.SOCKET_SERVER_PORT);

io.on("connection", async (socket) => {
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

  addBroadcasterSubscription(brodcasterUserId, (event) => socket.emit(event.type, event));

  socket.on("disconnect", () => {
    clearBroadCasterSubscriptions(brodcasterUserId);

    subscriptions.forEach((sub) => deleteSubscription(sub.id));
    console.log(`${user} disconnected`);
  });
});
