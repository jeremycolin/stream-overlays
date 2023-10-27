<script>
import { defineComponent, defineAsyncComponent } from "vue";

export default defineComponent({
  name: "FollowManager",
  props: {
    game: String,
  },
  methods: {
    follow() {
      return defineAsyncComponent(() => {
        return new Promise(async (resolve) => {
          try {
            const component = await import(`./games/${this.$props.game}.vue`);
            resolve(component);
          } catch (err) {
            const component = import("./games/hearthstone.vue");
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
