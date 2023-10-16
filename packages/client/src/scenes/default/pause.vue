<script>
import Experience from "@/three/experiences/coffee/Experience.js";
let experience;
export default {
  name: "pauseScene",
  mounted() {
    console.log("Scene -> Default Pause");
    experience = new Experience(this.$refs.canvas);
  },
  unmounted() {
    experience.destroy();
  },
};
</script>
<template>
  <div class="waiting-screen generic-background">
    <span class="text text-front js-text">pause café</span>
    <span class="text text-back js-text">pause café</span>
    <canvas ref="canvas" class="webgl"></canvas>
  </div>
</template>

<style lang="scss">
.waiting-screen {
  display: flex;
  position: relative;
  width: 1920px;
  height: 1080px;

  .webgl {
    position: fixed;
    top: 0;
    left: 0;
    outline: none;
    z-index: 10;
  }

  .text {
    position: absolute;
    top: 50%;
    left: 2vw;
    right: 2vw;
    transform: translateY(-50%);
    color: rgba(255, 255, 255, 0.5);
    pointer-events: none;
    font-size: 8vw;
    text-align: center;
    font-weight: 600;
    letter-spacing: 0.55vw;
  }

  .text-front {
    z-index: 20;
    -moz-text-stroke-color: rgba(255, 255, 255, 0.5);
    -webkit-text-stroke-color: rgba(255, 255, 255, 0.5);
    -moz-text-stroke-width: 0.085vw;
    -webkit-text-stroke-width: 0.085vw;
    -moz-text-fill-color: transparent;
    -webkit-text-fill-color: transparent;
  }

  .text-back {
    z-index: 1;
  }
}
</style>
