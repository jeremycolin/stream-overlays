<script>
import { computed } from "vue";
import { useRouter } from "vue-router";
import { io } from "socket.io-client";
import { EventTypes, TWITCH_GAMES } from "api";
import FollowManager from "@/alerts/follow/manager.vue";

export default {
  components: {
    FollowManager,
  },
  data() {
    return {
      followEvent: {},
      isDev: isDev,
      game: "",
    };
  },
  provide() {
    return {
      followEvent: computed(() => this.followEvent),
    };
  },
  async mounted() {
    await useRouter().isReady();
    const socket = io(__WEBSOCKET_ENDPOINT__, {
      query: { user: this.$route.params.user },
    });

    socket.on(EventTypes.INFO, (event) => {
      console.log("Info event: ", event);
      this.game = TWITCH_GAMES[event.game_name];
    });
    socket.on(EventTypes.FOLLOW, (event) => {
      if (!document.hidden) {
        console.log("Follow event: ", event);
        this.followEvent = event;
      }
    });
    socket.on(EventTypes.SUBSCRIBE, (event) => console.log("Subscribe event: ", event));
    socket.on(EventTypes.RAID, (event) => console.log("Raid event: ", event));
  },
};
</script>

<template>
  <div class="stream-overlay" :class="{ 'is-dev': isDev }">
    <router-view></router-view>
    <FollowManager :game="game" />
  </div>
</template>

<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Noto+Sans+Runic&family=Skranji&display=swap");
body {
  margin: 0;
  padding: 0;
}

* {
  &,
  &::before,
  &::after {
    box-sizing: border-box;
  }
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
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
