<script>
import * as PIXI from "pixi.js";
import { CRTFilter, RGBSplitFilter, GlitchFilter, ColorOverlayFilter, OutlineFilter } from "pixi-filters";
import _random from 'lodash/random';
import backgroundUrl from "@/assets/isaac/isaac.jpg";
import FontFaceObserver from 'fontfaceobserver';

let app;
let stage;
let renderer;
let ticker;
let texture;
let loadingImageBackground;
let background;
let filterRGB;
let filterCRT;
let filterTextRGB;
let filterGlitch;
let filterColor;
let filterOuline;
let text;
let intervalSprite;
let intervalSpriteVariant;
const spriteIdxMin = 1;
const spriteIdxMax = 56;
export default {
  name: "startScene",
  methods: {
    preloadImages (app) {
      for (let spriteIdx = spriteIdxMin; spriteIdx < spriteIdxMax; spriteIdx++) {
        app.loader.add(`/isaac/loading/loadimages-${spriteIdx.toString().padStart(3, '0')}.png`);
        app.loader.add(`/isaac/loading/loadimages-${spriteIdx.toString().padStart(3, '0')}_2.png`);
      }
      app.loader.load();
    }
  },
  async mounted() {
    console.log("Scene -> lbineau Start");
    app = new PIXI.Application({
      width: 1920,
      height: 1080,
      backgroundAlpha: 0,
    });

    this.$el.appendChild(app.view);
    stage = new PIXI.Container();
    app.stage.addChild(stage);
    renderer = PIXI.autoDetectRenderer();

    // preload loading images
    this.preloadImages(app);

    // Create a new texture
    texture = PIXI.Texture.from(backgroundUrl);
    background = new PIXI.Sprite(texture);

    background.anchor.set(0.5);
    background.x = app.screen.width / 2;
    background.y = app.screen.height / 2;

    loadingImageBackground = new PIXI.Sprite();
    loadingImageBackground.anchor.set(0.5);
    loadingImageBackground.x = app.screen.width / 2;
    loadingImageBackground.y = app.screen.height / 2 + 250;
    loadingImageBackground.scale.set(3);
    filterColor = new ColorOverlayFilter(0xFFFFFF);
    // applying big outline filter creates these drawing-like lines
    filterOuline = new OutlineFilter(40, 0x000000);
    loadingImageBackground.filters = [filterColor, filterOuline];

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

    stage.addChild(loadingImageBackground);

    filterTextRGB = new RGBSplitFilter();
    filterTextRGB.red = [-2, 0];
    filterTextRGB.green = [0, 2];
    filterTextRGB.blue = [0, 0];
    filterGlitch = new GlitchFilter();

    let font = new FontFaceObserver('Isaac', {});
    try {
      await font.load();      
    } catch (error) {
      console.warn(error);
    }

    // TEXT
    text = new PIXI.Text("J'arrive\nbientôt !", {
      fontFamily: "Isaac",
      fontSize: 200,
      lineHeight: 150,
      fill: 0xffffff,
      strokeThickness: 40,
      lineJoin: 'round',
      align: 'center'
    });

    text.anchor.set(0.5);
    text.x = app.screen.width / 2;
    text.y = app.screen.height / 2 - 200;

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

    // handle sprite changes
    const spriteIdxMin = 1;
    const spriteIdxMax = 56;
    let spriteIdx = spriteIdxMin;
    let spriteVariantIdx = 0;
    intervalSprite = setInterval(() => {
      spriteIdx = _random(spriteIdxMin, spriteIdxMax);
    }, 4000);

    intervalSpriteVariant = setInterval(() => {
      const texture1 = PIXI.Texture.from(`/isaac/loading/loadimages-${spriteIdx.toString().padStart(3, '0')}.png`);
      const texture2 = PIXI.Texture.from(`/isaac/loading/loadimages-${spriteIdx.toString().padStart(3, '0')}_2.png`);
      loadingImageBackground.texture = spriteVariantIdx % 2 === 0 ? texture1 : texture2;
      spriteVariantIdx++;
    }, 200);
    // EoF handle sprite changes

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
    loadingImageBackground = null;
    filterColor = null;
    filterOuline = null;
    clearInterval(intervalSprite);
    clearInterval(intervalSpriteVariant);
  },
};
</script>
<template>
  <div class="waiting-screen"></div>
</template>

<style lang="scss">
@import "./fonts.scss";

.waiting-screen {
  display: flex;
  position: relative;
  width: 1920px;
  height: 1080px;
  background-color: white;

  // Lory je sais que je devrais faire ça en css grid
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
