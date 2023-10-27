<script>
import * as PIXI from "pixi.js";
import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin.js";
import { RGBSplitFilter, GlitchFilter, DropShadowFilter } from "pixi-filters";
import { WebfontLoaderPlugin } from "pixi-webfont-loader";

import { addToPixiLoader } from "@/lib/utils";

PIXI.Loader.registerPlugin(WebfontLoaderPlugin);
gsap.registerPlugin(PixiPlugin);

// Pixi variables
let app;
let stage;
let ticker;
let renderer;
let followText;
let filterDropshadow;
let filterGlitch;
let filterTextRGB;

let tl;
let index;
let events;
let animate = false;

export default {
  name: "alert-follow-code",
  inject: ["followEvent"],
  watch: {
    followEvent(newVal) {
      if (newVal) {
        events.push(newVal);
        let anim = this.getAnimation();
        tl.add(anim);
        tl.play();
      }
    },
  },
  methods: {
    getAnimation() {
      return gsap.to(this.$refs.notification, {
        duration: 0.5,
        autoAlpha: 1, // Fade In
        repeat: 1, // we repeat only once
        repeatDelay: 4, // how long it stays on the screen
        yoyo: true, // yoyo = repeat the animation but reverse
        onStart: this.onAnimationStart,
        onComplete: this.onAnimationComplete,
      });
    },
    onAnimationStart() {
      const event = events[index];
      followText.text = ` followers.add(\"${event.user_name.toLowerCase()}\") `;
      animate = true;

      console.log(index, " debug queue event timestamp: ", event.timestamp, event.user_name);
      index++;
    },
    onAnimationComplete() {
      animate = false;
    },
    onQueueComplete() {
      tl.clear();
      events = [];
      index = 0;
    },
  },
  async mounted() {
    tl = gsap.timeline({
      onComplete: this.onQueueComplete,
    });
    tl.pause();
    events = [];
    index = 0;

    app = new PIXI.Application({
      width: 1920,
      height: 220,
      backgroundAlpha: 0,
    });

    stage = new PIXI.Container();
    ticker = PIXI.Ticker.shared;
    renderer = PIXI.autoDetectRenderer();

    gsap.set(this.$refs.notification, { autoAlpha: 0 });

    await addToPixiLoader(app, "Source Code Pro", "https://fonts.googleapis.com/css2?family=Source+Code+Pro");

    ticker.add(() => {
      if (animate) {
        filterGlitch.seed = Math.random();
        filterGlitch.offset = Math.random() * (Math.random() + 10);

        filterTextRGB.red = [Math.random() * 4, 0];
        filterTextRGB.red = [0, Math.random() * 4];
        renderer.render(stage);
      }
    });

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
    filterDropshadow = new DropShadowFilter();
    filterGlitch = new GlitchFilter();
    filterTextRGB = new RGBSplitFilter();
    filterTextRGB.red = [-2, 0];
    filterTextRGB.green = [0, 2];
    filterTextRGB.blue = [0, 0];

    followText.filters = [filterGlitch, filterTextRGB, filterDropshadow];
    stage.addChild(followText);

    this.$refs.canvas.appendChild(app.view);
    app.stage.addChild(stage);
  },
  unmounted() {
    app.destroy(true, { children: true });
    stage = null;
    ticker = null;
    renderer = null;
    followText = null;
    filterDropshadow = null;
    filterGlitch = null;
    filterTextRGB = null;

    tl.kill();
    index = 0;
    events = [];
    animate = false;
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
