import { EventTypesEnum, OauthTypesEnum, SubscriptionEvent } from "api";
import { Server, Socket } from "socket.io";
import { cleanBroadCasterSubscriptions, getBroadcasterSubscriptions, setBroadcasterSubscriptions } from "../events/broadcast";
import { deleteSubscription, getUserInfo, getOrSubscribeToType, getGame } from "../apis/twitch";
import { oAuthTokensPersistentStorage } from "../database/tokens";
import { validateUserOauthToken } from "../apis/oauth-twitch";

export const socketMiddleWare = (io: Server) => {
  const emitToRoom = (broadcasterUserId: string, eventType: EventTypesEnum, event: SubscriptionEvent) => {
    io.to(broadcasterUserId).emit(eventType, event);
  };

  io.of("/").adapter.on("join-room", async (broadcasterUserId, socketId) => {
    if (broadcasterUserId === socketId) {
      // this is the default room created by the socket, ignoring
      return;
    }

    if (io.of("/").adapter.rooms.get(broadcasterUserId)?.size === 1) {
      // if the room size is 1, it means we are the first socket in the broadcaster room
      // we subscribe to events we want to published for via Twitch API
      console.debug("subscribing to", broadcasterUserId);
      const subscriptions = (
        await Promise.all([
          getOrSubscribeToType(broadcasterUserId, EventTypesEnum.FOLLOW),
          getOrSubscribeToType(broadcasterUserId, EventTypesEnum.SUBSCRIBE),
          // getOrSubscribeToType(broadcasterUserId, EventTypesEnum.GIFT),
          // getOrSubscribeToType(broadcasterUserId, EventTypesEnum.RAID), // works but useless for now
        ])
      ).flat();

      setBroadcasterSubscriptions(broadcasterUserId, subscriptions, (event) => {
        console.debug("Emitting event: ", event);
        emitToRoom(broadcasterUserId, event.type, event);
      });
    }

    const game_name = await getGame(broadcasterUserId);
    if (game_name) {
      console.debug("Emitting game_name: ", game_name);
      emitToRoom(broadcasterUserId, EventTypesEnum.INFO, { type: EventTypesEnum.INFO, game_name });
    }
  });

  io.of("/").adapter.on("leave-room", (broadcasterUserId, socketId) => {
    if (broadcasterUserId === socketId) {
      // this is the default room created by the socket, ignoring
      return;
    }

    if (io.of("/").adapter.rooms.get(broadcasterUserId)?.size === 0) {
      // if the room is size 0, it means we are the last socket in the broadcaster room
      // we clean up Twitch API subscriptions
      console.debug("Cleaning subscriptions to", broadcasterUserId);

      const broadcasterSubscriptions = getBroadcasterSubscriptions(broadcasterUserId);
      if (!broadcasterSubscriptions) {
        return; // this should never happen in practice
      }

      const { twitchSubscriptions } = broadcasterSubscriptions;
      cleanBroadCasterSubscriptions(broadcasterUserId);
      twitchSubscriptions.forEach((sub) => deleteSubscription(sub.id));
    }
  });

  return async (socket: Socket) => {
    const user = socket.handshake.query.user as string;
    if (!user || user === "undefined") {
      console.warn(`invalid user, disconnecting socket`);
      socket.disconnect();
      return;
    }
    console.log(`${user} connected.`);

    const broadcasterInfo = await getUserInfo(user);
    if (!broadcasterInfo) {
      console.warn(`${user} (username) not found on Twitch, disconnecting socket`);
      socket.disconnect();
      return;
    }

    console.log("User broadcaster ID is: ", broadcasterInfo.id);
    console.log("Now checking if user has a valid token in db");

    const hasTokens = await oAuthTokensPersistentStorage.hasTokens(broadcasterInfo.id);

    if (!hasTokens) {
      console.log("User does not have a token in db, starting client oAuth flow");
      socket.emit(OauthTypesEnum.OAUTH_START);
      return;
    } else {
      console.log("User has a token in db, now validating the token with the Twitch API");
      const tokens = await oAuthTokensPersistentStorage.getTokens(broadcasterInfo.id);
      if (!tokens) {
        console.warn("Unable to retrieve tokens from database");
        socket.emit(OauthTypesEnum.OAUTH_START);
        return;
      }
      const { access_token, refresh_token } = tokens;
      const tokenInfo = await validateUserOauthToken({ access_token, refresh_token, user_id: broadcasterInfo.id });

      if (!tokenInfo) {
        console.warn("User token validation failed, starting client oAuth flow");
        socket.emit(OauthTypesEnum.OAUTH_START);
        return;
      }

      // in practice this should never happen as we are fetching token from broadcasterInfo.id
      if (tokenInfo.user_id !== broadcasterInfo.id) {
        console.error("User trying to connect with a token that does not belong to him, starting client oAuth flow");
        socket.emit(OauthTypesEnum.OAUTH_START);
        return;
      }
    }

    socket.emit(OauthTypesEnum.OAUTH_SUCCESS);
    socket.join(broadcasterInfo.id); // join the broadcaster room

    socket.on("disconnect", () => {
      console.log(`${user} disconnected`);
    });
  };
};
