<script>
import { defineComponent, defineAsyncComponent } from "vue";
import { alertsConfig, TWITCH_API_STREAM_GAME } from "../config";

export default defineComponent({
  name: "SubscribeManager",
  props: {
    game: String,
    user: String,
  },
  methods: {
    subscribe() {
      return defineAsyncComponent(() => {
        return new Promise(async (resolve) => {
          try {
            const userSubscribeAlert = alertsConfig[this.$props.user]?.subscribe || alertsConfig.default.subscribe;

            if (userSubscribeAlert === TWITCH_API_STREAM_GAME) {
              const component = await import(`./games/${this.$props.game}.vue`);
              resolve(component);
            } else {
              const component = await import(`./games/${userSubscribeAlert}.vue`);
              resolve(component);
            }
          } catch (err) {
            const component = import("../default/games/filou.vue");
            resolve(component);
          }
        });
      });
    },
  },
});
</script>

<template>
  <div class="subscribe-overlay"><component :is="subscribe()" event="subscribe" /></div>
</template>

<style lang="scss">
.subscribe-overlay {
  position: absolute;
  z-index: 1;
  width: 100%;
  height: 100%;
}
</style>
