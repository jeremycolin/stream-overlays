<script>
import followFilou from "../alerts/followFilou.vue";

export default {
  name: "endScene",
  components: {
    followFilou,
  },
  mounted() {
    console.log("Scene -> end");
  },
};
</script>

<template>
  <div class="end-scene">
    <followFilou></followFilou>
  </div>
</template>

<style lang="scss">
.end-scene {
  width: 100%;
  height: 100%;
}
</style>
