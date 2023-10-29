<script>
import * as PIXI from "pixi.js";
import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin.js";
import { WebfontLoaderPlugin } from "pixi-webfont-loader";
import { DropShadowFilter } from "pixi-filters";
import alertSound from "@/assets/sounds/alert.wav";

import { addToPixiLoader } from "@/lib/utils";

PIXI.Loader.registerPlugin(WebfontLoaderPlugin);
gsap.registerPlugin(PixiPlugin);

// Pixi variables
let app = null;
let stage = null;
let graphics = null;
let alertText = null;
let filterDropshadow = null;

let audio = null;
let tl;
let index;
let events;

export default {
  name: "alert-Filou",
  inject: ["followEvent", "subscribeEvent"],
  props: {
    event: "follow" | "subscribe",
  },
  watch: {
    followEvent(newVal) {
      if (this.$props.event !== "follow") {
        return;
      }
      if (newVal) {
        events.push(newVal);
        let anim = this.getAnimation();
        tl.add(anim);
        tl.play();
      }
    },
    subscribeEvent(newVal) {
      if (this.$props.event !== "subscribe") {
        return;
      }
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
        duration: 1.5,
        y: 25, // appearing from the top
        repeat: 1, // we repeat only once
        repeatDelay: 4, // how long it stays on the screen
        yoyo: true, // yoyo = repeat the animation but reverse
        ease: "elastic(1, 0.3)",
        onStart: this.onAnimationStart,
        onComplete: this.onAnimationComplete,
      });
    },
    onAnimationStart() {
      const event = events[index];
      alertText.text = ` BIENVENUE ${event.user_name.toUpperCase()}! `;

      audio.play();
      this.$refs.video.play();
      // Animate mask to reveal the text
      gsap.to(graphics, {
        duration: 1.9,
        width: 500,
        delay: 1.95,
      });

      console.log(index, " debug queue event timestamp: ", event.timestamp, event.user_name);
      index++;
    },
    onAnimationComplete() {
      this.$refs.video.pause();
      // reset mask animation values
      gsap.set(graphics, { width: 1 });
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
      width: 500,
      height: 220,
      backgroundAlpha: 0,
    });

    stage = new PIXI.Container();

    // TODO: preload sound + video
    audio = new Audio(alertSound);
    audio.volume = 0.35;

    this.$refs.video.pause();
    gsap.set(this.$refs.notification, { y: -525 });

    await addToPixiLoader(app, "https://fonts.googleapis.com/css2?family=Sue+Ellen+Francisco");

    alertText = new PIXI.Text("Bienvenue Jean Michel!", {
      fontFamily: "Sue Ellen Francisco",
      fontSize: 38,
      fontWeight: "400",
      letterSpacing: 4,
      fill: 0xffffff,
      wordWrap: false,
      align: "center",
      padding: 10,
    });

    alertText.anchor.set(0.5);
    alertText.x = 500 / 2;
    alertText.y = 220 / 2;

    filterDropshadow = new DropShadowFilter();
    alertText.filters = [filterDropshadow];

    stage.addChild(alertText);

    this.$refs.canvas.appendChild(app.view);
    app.stage.addChild(stage);

    graphics = new PIXI.Graphics();

    // MASK
    graphics.beginFill(0xde3249);
    graphics.drawRect(0, 0, 1, 500);
    graphics.endFill();

    alertText.mask = graphics;

    stage.addChild(graphics);
  },
  unmounted() {
    app.destroy(true, { children: true });
    stage = null;
    graphics = null;
    alertText = null;
    filterDropshadow = null;

    audio = null;

    tl.kill();
    index = 0;
    events = [];
  },
};
</script>

<template>
  <div class="alert-filou">
    <div class="alert-filou__notification" ref="notification">
      <div class="alert-filou__container">
        <div class="alert-filou__canvas" ref="canvas"></div>
        <video autoplay muted src="/src/assets/filou.mp4" ref="video"></video>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.alert-filou {
  width: 100%;
  height: 100%;

  &__notification {
    position: absolute;
    top: 25px;
    left: 25px;
    width: 500px;
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
