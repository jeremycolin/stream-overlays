<script>
import Experience from "@/three/experiences/cottage/Experience.js";
let experience;
export default {
  name: "endScene",
  mounted() {
    console.log("Scene -> Askowbol End");
    experience = new Experience({
      canvas: this.$refs.canvas,
      resize: false,
    });
  },
  unmounted() {
    experience.destroy();
  },
};
</script>

<template>
  <div class="end-scene">
    <span class="text text-front js-text">C'est fini, à bientôt!</span>
    <span class="text text-back js-text">C'est fini, à bientôt!</span>
    <canvas ref="canvas" class="webgl"></canvas>
  </div>
</template>

<style lang="scss">
.end-scene {
  width: 100%;
  height: 100%;
  background: #201919;

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
    color: #dcd6a6;
    font-family: "cartograph_cfbold_italic";
    pointer-events: none;
    font-size: 13vw;
    line-height: 1.2;
    font-weight: 300;
    text-align: center;
    letter-spacing: 0.55vw;
  }

  .text-front {
    z-index: 20;
    -moz-text-stroke-color: #dcd6a6;
    -webkit-text-stroke-color: #dcd6a6;
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
