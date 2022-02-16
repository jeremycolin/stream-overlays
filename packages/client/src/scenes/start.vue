<template>
  <component :is="scene" />
</template>

<script>
import { defineComponent, defineAsyncComponent } from "vue";

export default defineComponent({
  name: "SceneManager",
  data() {
    return {
      user: "",
    };
  },
  computed: {
    scene() {
      return defineAsyncComponent({
        loader: () => {
          return import(`./${this.user}/start.vue`);
        },
        errorComponent: import(`./default/start.vue`), // does not work if default import file is missing
        timeout: 3000,
      });
    },
  },
  created() {
    this.user = this.$route.params.user;
  },
});
</script>
