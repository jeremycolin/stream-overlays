<script>
import * as PIXI from "pixi.js";
import { CRTFilter, RGBSplitFilter, GlitchFilter } from "pixi-filters";
import backgroundUrl from "@/assets/background-code.png";

let app;
let stage;
let renderer;
let ticker;
let texture;
let background;
let filterRGB;
let filterCRT;
let filterTextRGB;
let filterGlitch;
let text;
export default {
  name: "startScene",
  mounted() {
    console.log("Scene -> Samyz_ Start");
    app = new PIXI.Application({
      width: 1920,
      height: 1080,
      backgroundAlpha: 0,
    });

    this.$el.appendChild(app.view);
    stage = new PIXI.Container();
    app.stage.addChild(stage);
    renderer = PIXI.autoDetectRenderer();

    // Create a new texture
    texture = PIXI.Texture.from(backgroundUrl);
    background = new PIXI.Sprite(texture);

    background.anchor.set(0.5);
    background.x = 1920 / 2;
    background.y = 1080 / 2;

    // create filters from pixi filters
    filterRGB = new RGBSplitFilter();
    filterRGB.red = [-5, 0];
    filterRGB.green = [0, 5];
    filterRGB.blue = [0, 0];

    filterCRT = new CRTFilter();
    filterCRT.lineWidth = 5;
    filterCRT.lineContrast = 0.3;
    filterCRT.noise = 0.2;
    filterCRT.time = 0.5;

    background.filters = [filterCRT, filterRGB];
    stage.addChild(background);

    filterTextRGB = new RGBSplitFilter();
    filterTextRGB.red = [-2, 0];
    filterTextRGB.green = [0, 2];
    filterTextRGB.blue = [0, 0];
    filterGlitch = new GlitchFilter();

    // TEXT
    text = new PIXI.Text("SAMYZ TV", {
      fontFamily: "Arial",
      fontSize: 200,
      fill: 0xffffff,
    });

    text.anchor.set(0.5);
    text.x = 1920 / 2;
    text.y = 1080 / 2;

    text.filters = [filterGlitch, filterTextRGB];

    ticker = PIXI.Ticker.shared;
    ticker.add(() => {
      filterCRT.seed = Math.random();
      filterCRT.time += 0.5;

      filterGlitch.seed = Math.random();
      filterGlitch.offset = Math.random() * (Math.random() + 5);

      filterTextRGB.red = [Math.random() * 4, 0];
      filterTextRGB.red = [0, Math.random() * 4];
      renderer.render(stage);
    });
    stage.addChild(text);
  },
  unmounted() {
    app.destroy(true, { children: true });
    stage = null;
    renderer = null;
    ticker = null;
    texture = null;
    background = null;
    filterRGB = null;
    filterCRT = null;
    filterTextRGB = null;
    text = null;
  },
};
</script>

<template>
  <div class="start-scene"></div>
</template>

<style lang="scss">
.start-scene {
  width: 100%;
  height: 100%;

  canvas {
    position: absolute;
    z-index: 0;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
}
</style>
