<script>
import followFilou from "../alerts/followFilou.vue";

export default {
  name: "liveScene",
  components: {
    followFilou: followFilou,
  },
  mounted() {
    console.log("Scene -> live");
  },
};
</script>

<template>
  <div class="live-scene">
    <followFilou></followFilou>
  </div>
</template>

<style lang="scss">
.live-scene {
  width: 100%;
  height: 100%;
}
</style>
