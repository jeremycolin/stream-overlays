<script>
import followCode from "../alerts/followCode.vue";

export default {
  name: "liveScene",
  components: {
    followCode,
  },
  mounted() {
    console.log("Scene -> live");
  },
};
</script>

<template>
  <div class="live-scene">
    <followCode></followCode>
  </div>
</template>

<style lang="scss">
.live-scene {
  width: 100%;
  height: 100%;
}
</style>
