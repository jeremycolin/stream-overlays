<script>
import { computed } from "vue";
import { io } from "socket.io-client";
import { EventTypes, OauthTypes, TWITCH_GAMES } from "api";
import AppTitle from "@/components/title.vue";
import SceneManager from "@/scenes/manager.vue";
import FollowManager from "@/alerts/follow/manager.vue";
import { nonce } from "@/lib/auth";

export default {
  name: "overlay",
  components: {
    AppTitle,
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
        scope: "moderator:read:followers channel:read:subscriptions",
        state,
      });
      window.location.href = `https://id.twitch.tv/oauth2/authorize?${params.toString()}`;
    },
  },
};
</script>

<template>
  <div v-if="state === 'loading'" class="auth generic-background">
    <app-title></app-title>
    <div class="card">
      <div class="text-info">Loading..</div>
    </div>
  </div>
  <div v-else-if="state === 'oauth:start'" class="auth generic-background">
    <app-title></app-title>
    <div class="card">
      <div class="text-info">
        <h3>Hey {{ user }}! 👋</h3>
        <p class="details">Looks like we need to renew your Twitch permissions</p>
      </div>
      <button @click="handleAuth" class="auth-button">{{ "Allow" }}</button>
    </div>
  </div>
  <div v-else class="stream-overlay" :class="{ 'is-dev': isDev }">
    <SceneManager />
    <FollowManager :game="game" />
  </div>
</template>

<style lang="scss">
.auth {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .card {
    width: 560px;
    padding: 1.5rem;
    color: #04060a;
    backdrop-filter: blur(16px) saturate(180%);
    -webkit-backdrop-filter: blur(16px) saturate(180%);
    background-color: rgba(255, 255, 255, 0.75);
    border-radius: 12px;
    border: 1px solid rgba(209, 213, 219, 0.3);
  }

  .text-info {
    h3 {
      font-weight: 500;
      margin: 0;
      text-transform: capitalize;
    }
    .details {
      margin-top: 1rem;
      color: rgb(75, 86, 99);
    }
  }

  .auth-button {
    cursor: pointer;
    background-color: rgb(75, 86, 99);
    background-image: linear-gradient(rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0));
    border: 1px solid #6b7280;
    color: white;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    padding: 0.375rem 0.75rem;
    box-shadow: 0 1px 1px rgba(18, 21, 26, 0.075);
    font-weight: 500;
    line-height: 1.5rem;
    padding: 0.5rem 1rem;
    text-align: center;
    user-select: none;

    &:hover {
      background-color: #404954;
    }
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
