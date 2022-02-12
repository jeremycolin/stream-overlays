<script>
import { computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { io } from "socket.io-client";
import { EventTypes } from "api";

export default {
  data() {
    return {
      followEvent: {},
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
  <router-view></router-view>
</template>

<style>
body {
  margin: 0;
  padding: 0;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
