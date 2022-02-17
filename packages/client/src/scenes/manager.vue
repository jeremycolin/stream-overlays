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
      return defineAsyncComponent(() => {
        return new Promise(async (resolve) => {
          try {
            const component = await import(`./${user}/${scene}.vue`);
            resolve(component);
          } catch (err) {
            const component = import(`./default/${scene}.vue`);
            resolve(component);
          }
        });
      });
    },
  },
});
</script>
