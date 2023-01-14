<script>
import followValheim from "@/alerts/followValheim.vue";

export default {
  name: "liveScene",
  components: {
    followValheim,
  },
  mounted() {
    console.log("Scene -> Askowbol live");
  },
};
</script>

<template>
  <div class="live-scene">
    <followValheim></followValheim>
  </div>
</template>

<style lang="scss">
.live-scene {
  width: 100%;
  height: 100%;
}
</style>
