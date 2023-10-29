<script>
import { defineComponent, defineAsyncComponent } from "vue";
import { alertsConfig, TWITCH_API_STREAM_GAME } from "../config";

export default defineComponent({
  name: "FollowManager",
  props: {
    game: String,
    user: String,
  },
  methods: {
    follow() {
      return defineAsyncComponent(() => {
        return new Promise(async (resolve) => {
          try {
            const userFollowAlert = alertsConfig[this.$props.user]?.follow || alertsConfig.default.follow;

            if (userFollowAlert === TWITCH_API_STREAM_GAME) {
              const component = await import(`./games/${this.$props.game}.vue`);
              resolve(component);
            } else {
              const component = await import(`./games/${userFollowAlert}.vue`);
              resolve(component);
            }
          } catch (err) {
            const component = import("./games/filou.vue");
            resolve(component);
          }
        });
      });
    },
  },
});
</script>

<template>
  <div class="follow-overlay"><component :is="follow()" /></div>
</template>

<style lang="scss">
.follow-overlay {
  position: absolute;
  z-index: 1;
  width: 100%;
  height: 100%;
}
</style>
