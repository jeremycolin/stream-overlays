<script>
import { computed } from "vue";
import { io } from "socket.io-client";
import { EventTypes, OauthTypes, TWITCH_GAMES } from "api";
import SceneManager from "@/scenes/manager.vue";
import FollowManager from "@/alerts/follow/manager.vue";
import { nonce } from "@/lib/auth";

export default {
  name: "overlay",
  components: {
    SceneManager,
    FollowManager,
  },
  data() {
    const { user } = this.$route.params;

    return {
      isDev: IS_DEV,
      game: "",
      followEvent: {},
      state: "loading",
      user,
    };
  },
  provide() {
    return {
      followEvent: computed(() => this.followEvent),
    };
  },

  beforeCreate() {
    const socket = io(__WEBSOCKET_ENDPOINT__, {
      query: { user: this.$route.params.user },
    });

    socket.once(OauthTypes.OAUTH_START, () => {
      this.state = "oauth:start";
    });

    socket.once(OauthTypes.OAUTH_SUCCESS, () => {
      this.state = "oauth:success";
    });

    socket.on(EventTypes.INFO, (event) => {
      console.log("Info event: ", event);
      this.game = TWITCH_GAMES[event.game_name];
    });
    socket.on(EventTypes.FOLLOW, (event) => {
      console.log("Follow event: ", event);
      this.followEvent = event;
    });
    socket.on(EventTypes.SUBSCRIBE, (event) => console.log("Subscribe event: ", event));
    socket.on(EventTypes.RAID, (event) => console.log("Raid event: ", event));
  },
  methods: {
    handleAuth() {
      const state = nonce(32);
      window.sessionStorage.setItem("oauth-state", JSON.stringify({ path: this.$route.path, state }));

      const params = new URLSearchParams({
        redirect_uri: TWITCH_OAUTH_REDIRECT_URL,
        client_id: APP_CLIENT_ID,
        response_type: "code",
        scope: encodeURI("moderator:read:followers"),
        state,
      });
      window.location.href = `https://id.twitch.tv/oauth2/authorize?${params.toString()}`;
    },
  },
};
</script>

<template>
  <div v-if="state === 'loading'" class="auth">
    <div class="text-info">Loading..</div>
  </div>
  <div v-else-if="state === 'oauth:start'" class="auth">
    <div class="text-info">
      <div>Hey {{ user }}!</div>
      <div class="details">Looks like we need to renew your Twitch permissions</div>
    </div>
    <button @click="handleAuth" class="auth-button">{{ "Allow Twitch permissions for overlays" }}</button>
  </div>
  <div v-else class="stream-overlay" :class="{ 'is-dev': isDev }">
    <SceneManager />
    <FollowManager :game="game" />
  </div>
</template>

<style lang="scss">
.auth {
  width: 100%;
  height: 100%;
  background-color: lightcoral;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .text-info {
    color: white;
    font-size: 4rem;
    position: relative;
    top: -10%;

    .details {
      margin-top: 1rem;
      font-size: 2rem;
    }
  }

  .auth-button {
    position: relative;
    top: -10%;

    margin-top: 4rem;
    font-size: 2rem;
    padding: 1rem 2rem;
    color: darkslategray;
    border: 1px solid white;
    border-radius: 20px;
    cursor: pointer;
    display: inline-block;
  }
}

.stream-overlay {
  display: flex;
  position: relative;
  width: 1920px;
  height: 1080px;
  overflow: hidden;

  &.is-dev {
    background: grey;
  }
}
</style>
