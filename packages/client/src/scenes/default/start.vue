<script>
import followCode from "@/alerts/followCode.vue";

import * as PIXI from "pixi.js";
import { CRTFilter, RGBSplitFilter, GlitchFilter } from "pixi-filters";
import backgroundUrl from "@/assets/background-code.png";

const app = new PIXI.Application({
  width: 1920,
  height: 1080,
  backgroundAlpha: 0,
});

export default {
  name: "startScene",
  components: {
    followCode,
  },
  mounted() {
    console.log("Scene -> start");

    this.$el.appendChild(app.view);
    const stage = new PIXI.Container();
    app.stage.addChild(stage);
    let renderer = PIXI.autoDetectRenderer();

    let ticker = PIXI.Ticker.shared;
    ticker.add(() => {
      filterCRT.seed = Math.random();
      filterCRT.time += 0.5;

      filterGlitch.seed = Math.random();
      filterGlitch.offset = Math.random() * (Math.random() + 5);

      filterTextRGB.red = [Math.random() * 4, 0];
      filterTextRGB.red = [0, Math.random() * 4];
      renderer.render(stage);
    });

    // Create a new texture
    const texture = PIXI.Texture.from(backgroundUrl);
    const background = new PIXI.Sprite(texture);

    background.anchor.set(0.5);
    background.x = 1920 / 2;
    background.y = 1080 / 2;
    // create filters from pixi default filters
    //   new PIXI.filters.NoiseFilter({
    //       noise: 0.14,
    //       seed: 0.44786
    //     }

    // create filters from pixi filters
    const filterRGB = new RGBSplitFilter();
    filterRGB.red = [-5, 0];
    filterRGB.green = [0, 5];
    filterRGB.blue = [0, 0];

    const filterCRT = new CRTFilter();
    CRTFilter.lineWidth = 5;
    CRTFilter.lineContrast = 0.3;
    CRTFilter.noise = 0.2;
    CRTFilter.time = 0.5;

    background.filters = [filterCRT, filterRGB];
    stage.addChild(background);

    const filterTextRGB = new RGBSplitFilter();
    filterTextRGB.red = [-2, 0];
    filterTextRGB.green = [0, 2];
    filterTextRGB.blue = [0, 0];
    const filterGlitch = new GlitchFilter();
    let text = new PIXI.Text("ERROR", {
      fontFamily: "Arial",
      fontSize: 200,
      fill: 0xffffff,
    });

    text.anchor.set(0.5);
    text.x = 1920 / 2;
    text.y = 1080 / 2;

    text.filters = [filterGlitch, filterTextRGB];

    stage.addChild(text);
  },
};
</script>

<template>
  <div class="waiting-screen">
    <followCode></followCode>
  </div>
</template>

<style lang="scss">
.waiting-screen {
  display: flex;
  position: relative;
  width: 1920px;
  height: 1080px;

  // Lory je sais que je devrais faire ça en css grid
  canvas {
    position: absolute;
    z-index: 0;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }

  &::after,
  &::before {
    position: absolute;
    content: "";
    display: block;
    top: 0;
    left: 0;
    right: 0;
    height: 100px;
    // background: black;
  }

  &::after {
    top: auto;
    bottom: 0;
  }
}
</style>
