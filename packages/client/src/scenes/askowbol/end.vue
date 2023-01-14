<script>
import followSoT from "@/alerts/followSoT.vue";

import * as PIXI from "pixi.js";
import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin.js";
import { AdjustmentFilter, TiltShiftFilter, DropShadowFilter } from "pixi-filters";

import backgroundUrl from "@/assets/background-end.mp4";

import { addToPixiLoader } from "@/utils.js";

const frame = [
  {
    path: [
      0, 1060.5, 13.5, 1058.5, 26.9, 1060.5, 39, 1058.5, 42.8, 1060.5, 52.4, 1058.5, 67.2, 1058.5, 81.7, 1060.5, 113, 1056.5, 119.7, 1060.5,
      155.5, 1058.5, 155.5, 1060.5, 162.6, 1060.5, 166.5, 1056.5, 169.5, 1058.5, 175.5, 1058.5, 180.7, 1056.5, 261.7, 1058.5, 261.7, 1060.5,
      271.8, 1060.5, 276.5, 1056.5, 308.2, 1056.5, 390.1, 1057.5, 418.5, 1058.5, 461.7, 1056.5, 504.4, 1060.5, 547.6, 1058.5, 583.2, 1058.5,
      633.5, 1056.5, 674.5, 1058.5, 710.1, 1056.5, 730.9, 1058.5, 742.9, 1056.5, 765, 1053.5, 779, 1057, 811.9, 1057, 875.2, 1057, 892.9,
      1060.5, 907.3, 1060.5, 911.3, 1057, 926.4, 1057, 969.4, 1058.5, 987.4, 1054.5, 999.9, 1055.5, 1023.4, 1053.5, 1065, 1057, 1091.8,
      1057, 1102.7, 1060.5, 1133.5, 1058.5, 1182.1, 1057, 1209.7, 1057, 1222.3, 1059.5, 1226.1, 1060.5, 1231.3, 1057, 1257.3, 1057, 1278.9,
      1053.5, 1333.3, 1057, 1389.2, 1060.5, 1459.7, 1057, 1518.3, 1057, 1584.8, 1057, 1639.3, 1055.5, 1685.9, 1055.5, 1706.4, 1057, 1717.3,
      1059.5, 1751.4, 1058.5, 1764, 1055.5, 1790.9, 1058.5, 1842.9, 1058.5, 1874.3, 1057.5, 1881.4, 1059.5, 1889.5, 1055.5, 1905.7, 1055.5,
      1910.1, 1058.5, 1920, 1058.5, 1920, 1078.5, 0, 1082.7,
    ],
    fill: "0x000000",
  },
  {
    path: [
      0, 17.7, 13.5, 19.7, 26.9, 17.7, 39, 19.7, 42.8, 17.7, 52.4, 19.7, 67.2, 19.7, 81.7, 17.7, 113, 21.7, 119.7, 17.7, 155.5, 19.7, 155.5,
      17.7, 162.6, 17.7, 166.5, 21.7, 169.5, 19.7, 175.5, 19.7, 180.7, 21.7, 261.7, 19.7, 261.7, 17.7, 271.8, 17.7, 276.5, 21.7, 308.2,
      21.7, 390.1, 20.7, 418.5, 19.7, 461.7, 21.7, 504.4, 17.7, 547.6, 19.7, 583.2, 19.7, 633.5, 21.7, 674.5, 19.7, 710.1, 21.7, 730.9,
      19.7, 742.9, 21.7, 765, 24.7, 779, 21.2, 811.9, 21.2, 875.2, 21.2, 892.9, 17.7, 907.3, 17.7, 911.3, 21.2, 926.4, 21.2, 969.4, 19.7,
      987.4, 23.7, 999.9, 22.7, 1023.4, 24.7, 1065, 21.2, 1091.8, 21.2, 1102.7, 17.7, 1133.5, 19.7, 1182.1, 21.2, 1209.7, 21.2, 1222.3,
      18.7, 1226.1, 17.7, 1231.3, 21.2, 1257.3, 21.2, 1278.9, 24.7, 1333.3, 21.2, 1389.2, 17.7, 1459.7, 21.2, 1518.3, 21.2, 1584.8, 21.2,
      1639.3, 22.7, 1685.9, 22.7, 1706.4, 21.2, 1717.3, 18.7, 1751.4, 19.7, 1764, 22.7, 1790.9, 19.7, 1842.9, 19.7, 1874.3, 20.7, 1881.4,
      18.7, 1889.5, 22.7, 1905.7, 22.7, 1910.1, 19.7, 1920, 19.7, 1920, -0.2, 0, -4.5,
    ],
    fill: "0x000000",
  },
];
gsap.registerPlugin(PixiPlugin);

// Pixi variables
let app;
let stage;
let videoTexture;
let videoSprite;
let video;
let filterDropshadow;
let byeText;
let filterTiltShift;
let filterAdjustment;
let graphics;

// scene settings
const scene = {
  width: 1920,
  height: 1080,
};

export default {
  name: "endScene",
  components: {
    followSoT,
  },
  async mounted() {
    console.log("Scene -> Askowbol End");

    app = new PIXI.Application({
      width: scene.width,
      height: scene.height,
      backgroundAlpha: 0,
      antialias: true,
      autoDensity: true,
    });

    this.$el.appendChild(app.view);
    stage = new PIXI.Container();
    app.stage.addChild(stage);

    // FILTERS
    filterTiltShift = new TiltShiftFilter();
    filterTiltShift.blur = 13;
    filterTiltShift.radientBlur = 450;

    const startPoint = new PIXI.Point(0, 950);
    filterTiltShift.start = startPoint;

    const endPoint = new PIXI.Point(600, 950);
    filterTiltShift.end = endPoint;

    filterAdjustment = new AdjustmentFilter();
    filterAdjustment.brightness = 1.3;

    // BACKGROUND VIDEO
    videoTexture = PIXI.Texture.from(backgroundUrl);
    videoSprite = new PIXI.Sprite(videoTexture);
    videoTexture.baseTexture.resource.autoPlay = true;

    videoSprite.width = scene.width;
    videoSprite.height = scene.height;

    video = videoTexture.baseTexture.resource.source;
    video.loop = true;
    video.muted = true;

    videoSprite.filters = [filterTiltShift, filterAdjustment];

    stage.addChild(videoSprite);

    await addToPixiLoader(app, "https://fonts.googleapis.com/css2?family=Sue+Ellen+Francisco");

    byeText = new PIXI.Text("À BIENTÔT!", {
      fontFamily: "Sue Ellen Francisco",
      fontSize: 300,
      fontWeight: "400",
      letterSpacing: 4,
      fill: 0xffffff,
      wordWrap: false,
      align: "center",
      padding: 100,
    });

    byeText.anchor.set(0.5);
    byeText.x = scene.width / 2;
    byeText.y = 350;

    filterDropshadow = new DropShadowFilter();
    byeText.filters = [filterDropshadow];

    stage.addChild(byeText);

    // black frame top & bottom
    graphics = new PIXI.Graphics();

    frame.forEach((path) => {
      graphics.lineStyle(0);
      graphics.beginFill(path.fill, 1);
      graphics.drawPolygon(path.path);
      graphics.endFill();
    });

    stage.addChild(graphics);
  },
};
</script>

<template>
  <div class="end-scene">
    <followSoT></followSoT>
  </div>
</template>

<style lang="scss">
.end-scene {
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
