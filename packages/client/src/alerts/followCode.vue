<script>
import * as PIXI from "pixi.js";
import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin.js";
import { RGBSplitFilter, GlitchFilter, DropShadowFilter } from "pixi-filters";
import { WebfontLoaderPlugin } from "pixi-webfont-loader";

PIXI.Loader.registerPlugin(WebfontLoaderPlugin);
gsap.registerPlugin(PixiPlugin);

const app = new PIXI.Application({
  width: 1920,
  height: 220,
  backgroundAlpha: 0,
});

const stage = new PIXI.Container();
let ticker = PIXI.Ticker.shared;
let renderer = PIXI.autoDetectRenderer();
let followText;

export default {
  name: "alert-follow-code",
  inject: ["followEvent"],
  watch: {
    followEvent() {
      this.drawFollowEvent();
    },
  },
  methods: {
    drawFollowEvent() {
      followText.text = ` followers.add(\"${this.followEvent.user_name.toLowerCase()}\") `;
      gsap.to(this.$refs.notification, 0.5, {
        autoAlpha: 1, // appearing from the top
        repeat: 1, // we repeat only once
        repeatDelay: 4, // how long it stays on the screen
        yoyo: true, // yoyo = repeat the animation but reverse
      });
    },
  },
  async mounted() {
    gsap.set(this.$refs.notification, { autoAlpha: 0 });

    app.loader.add({ name: "From Google 1", url: "https://fonts.googleapis.com/css2?family=Source+Code+Pro" });

    const pixiLoader = new Promise((resolve) => {
      app.loader.load(() => resolve());
    });
    await pixiLoader;

    ticker.add(() => {
      filterGlitch.seed = Math.random();
      filterGlitch.offset = Math.random() * (Math.random() + 10);

      filterTextRGB.red = [Math.random() * 4, 0];
      filterTextRGB.red = [0, Math.random() * 4];
      renderer.render(stage);
    });
    ticker.speed = 2;

    followText = new PIXI.Text('followers.add("didier")', {
      fontFamily: "Source Code Pro",
      fontSize: 50,
      fontWeight: "400",
      letterSpacing: 1,
      fill: 0xffffff,
      wordWrap: false,
      align: "center",
    });

    followText.x = 25;
    followText.y = 25;
    const filterDropshadow = new DropShadowFilter();
    const filterGlitch = new GlitchFilter();
    const filterTextRGB = new RGBSplitFilter();
    filterTextRGB.red = [-2, 0];
    filterTextRGB.green = [0, 2];
    filterTextRGB.blue = [0, 0];

    followText.filters = [filterGlitch, filterTextRGB, filterDropshadow];
    stage.addChild(followText);

    this.$refs.canvas.appendChild(app.view);
    app.stage.addChild(stage);
  },
};
</script>

<template>
  <div class="follow-code">
    <div class="follow-code__notification" ref="notification">
      <div class="follow-code__container">
        <div class="follow-code__canvas" ref="canvas"></div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.follow-code {
  width: 100%;
  height: 100%;

  &__notification {
    position: absolute;
    top: 25px;
    left: 25px;
    width: 1920px;
    height: 220px;
    border-radius: 10px;
    overflow: hidden;
    z-index: 10;

    video {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      z-index: 5;
      transform: scaleX(-1);
    }
  }

  &__container {
    position: relative;
    width: 100%;
    height: 100%;
  }

  &__canvas {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 10;
  }
}
</style>
