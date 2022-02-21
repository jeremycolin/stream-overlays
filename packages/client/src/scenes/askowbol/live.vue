<script>
import followSoT from "@/alerts/followSoT.vue";

export default {
  name: "liveScene",
  components: {
    followSoT,
  },
  mounted() {
    console.log("Scene -> Askowbol live");
  },
};
</script>

<template>
  <div class="live-scene">
    <followSoT></followSoT>
  </div>
</template>

<style lang="scss">
.live-scene {
  width: 100%;
  height: 100%;
}
</style>
