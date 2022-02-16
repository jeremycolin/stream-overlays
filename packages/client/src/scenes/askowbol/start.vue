<script>
import followFilou from "@/alerts/followFilou.vue";

import * as PIXI from "pixi.js";
import backgroundUrl from "@/assets/background-askowbol.jpg";
import { MotionBlurFilter, DropShadowFilter } from "pixi-filters";
import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin.js";

import { addToPixiLoader } from "@/utils.js";

gsap.registerPlugin(PixiPlugin);

const app = new PIXI.Application({
  width: 1920,
  height: 1080,
  backgroundAlpha: 0,
});

export default {
  name: "startScene",
  components: {
    followFilou,
  },
  async mounted() {
    console.log("Scene -> start");

    this.$el.appendChild(app.view);
    const stage = new PIXI.Container();
    app.stage.addChild(stage);
    let renderer = PIXI.autoDetectRenderer();

    // FILTERS
    const filterNoise = new PIXI.filters.NoiseFilter();
    filterNoise.noise = 0.1;
    filterNoise.seed = 0.01;

    const filterMotionBlur = new MotionBlurFilter();
    filterMotionBlur.kernelSize = 15;

    const filterDropshadow = new DropShadowFilter();

    // BACKGROUND IMAGE
    const texture = PIXI.Texture.from(backgroundUrl);
    const background = new PIXI.Sprite(texture);

    background.anchor.set(0.5);
    background.x = 1920 / 2;
    background.y = 1080 / 2;

    background.filters = [filterNoise];

    stage.addChild(background);

    await addToPixiLoader(app, "https://fonts.googleapis.com/css2?family=Sue+Ellen+Francisco");

    // TEXT
    let textOne = new PIXI.Text("ÇA", {
      fontFamily: "Sue Ellen Francisco",
      fontSize: 90,
      padding: 50,
      fill: 0xffffff,
    });

    textOne.anchor.set(0.5);
    textOne.x = 600;
    textOne.y = 0;

    textOne.filters = [filterMotionBlur, filterDropshadow];
    stage.addChild(textOne);

    let textTwo = new PIXI.Text("COMMENCE", {
      fontFamily: "Sue Ellen Francisco",
      fontSize: 200,
      padding: 50,
      fill: 0xffffff,
    });

    textTwo.anchor.set(0.5);
    textTwo.x = 1920 / 2;
    textTwo.y = 0;

    textTwo.filters = [filterMotionBlur, filterDropshadow];
    stage.addChild(textTwo);

    let textThree = new PIXI.Text("BIENTÔT", {
      fontFamily: "Sue Ellen Francisco",
      fontSize: 90,
      padding: 50,
      fill: 0xffffff,
    });

    textThree.anchor.set(0.5);
    textThree.x = 1300;
    textThree.y = 0;

    textThree.filters = [filterMotionBlur, filterDropshadow];
    stage.addChild(textThree);

    // TOP AND BOTTOM BAR
    const graphics = new PIXI.Graphics();

    graphics.beginFill(0x000000);
    graphics.drawRect(0, 0, 1920, 100);
    graphics.endFill();

    graphics.beginFill(0x000000);
    graphics.drawRect(0, 980, 1920, 100);
    graphics.endFill();

    graphics.filters = [filterMotionBlur];
    app.stage.addChild(graphics);

    // TICKER FOR FILTER ANIMATION
    let ticker = PIXI.Ticker.shared;
    ticker.add(() => {
      filterNoise.noise = Math.random() / 5;
      filterNoise.seed = Math.random() / 10;
      filterMotionBlur.velocity.x = Math.random() * 10;
      filterMotionBlur.velocity.y = Math.random() * 20;
      renderer.render(stage);
    });

    const tl = gsap.timeline({ repeat: -1, repeatDelay: 1 });

    tl.to(textOne, { y: 370, duration: 0.5, ease: "power3.inOut" });
    tl.to(textTwo, { y: 1080 / 2, duration: 0.5, ease: "power3.inOut" });
    tl.to(textThree, { y: 670, duration: 0.5, ease: "power3.inOut" });
    tl.to(textOne, { y: 1080, duration: 0.5, ease: "power3.inOut" }, "+=10");
    tl.to(textTwo, { y: 1200, duration: 0.5, ease: "power3.inOut" }, "-=0.5");
    tl.to(textThree, { y: 1080, duration: 0.5, ease: "power3.inOut" }, "-=0.5");
  },
};
</script>

<template>
  <div class="start-scene">
    <followFilou></followFilou>
  </div>
</template>

<style lang="scss">
.start-scene {
  width: 100%;
  height: 100%;

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
