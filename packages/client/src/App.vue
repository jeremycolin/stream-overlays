<script>
import { computed } from "vue";
import { useRouter } from "vue-router";
import { io } from "socket.io-client";
import { EventTypes } from "api";

export default {
  data() {
    return {
      followEvent: {},
      isDev: isDev,
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

    socket.on(EventTypes.FOLLOW, (event) => {
      console.log("Follow event: ", event);
      this.followEvent = event;
    });
    socket.on(EventTypes.SUBSCRIBE, (event) => console.log("Subscribe event: ", event));
    socket.on(EventTypes.RAID, (event) => console.log("Raid event: ", event));
  },
};
</script>

<template>
  <div class="stream-overlay" :class="{ 'is-dev': isDev }">
    <router-view></router-view>
  </div>
</template>

<style lang="scss">
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
    background-image: url("@/assets/background-dev.jpg");
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center center;
  }
}
</style>
