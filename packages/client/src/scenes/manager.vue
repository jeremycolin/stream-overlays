<template>
  <component :is="scene"></component>
</template>

<script>
import { defineComponent, defineAsyncComponent } from "vue";

export default defineComponent({
  name: "SceneManager",
  computed: {
    scene() {
      const { user, scene } = this.$route.params;
      return defineAsyncComponent({
        loader: () => import(`./${user}/${scene}.vue`),
        errorComponent: defineAsyncComponent({
          loader: () => import(`./default/${scene}.vue`),
        }),
        timeout: 5000,
      });
    },
  },
});
</script>
