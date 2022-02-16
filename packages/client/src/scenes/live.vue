<script>
import followAnno from "@/alerts/followAnno.vue";

export default {
  name: "liveScene",
  components: {
    followAnno,
  },
  mounted() {
    console.log("Scene -> live");
  },
};
</script>

<template>
  <div class="live-scene">
    <followAnno></followAnno>
  </div>
</template>

<style lang="scss">
.live-scene {
  width: 100%;
  height: 100%;
}
</style>
