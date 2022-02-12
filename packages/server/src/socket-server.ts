import { EventTypesEnum } from "api";
import { createServer } from "http";
import { Server } from "socket.io";
import { addBroadcasterSubscription, clearBroadCasterSubscriptions } from "./broadcast";
import { deleteSubscription, getBroadcasterIdFromUser, getOrSubscribeToType } from "./apis/twitch";

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5000",
  },
});

httpServer.listen(3000);

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
