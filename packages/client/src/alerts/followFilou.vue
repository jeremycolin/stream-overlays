<script>
import * as PIXI from "pixi.js";
import { gsap, Elastic } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin.js";
import { WebfontLoaderPlugin } from "pixi-webfont-loader";
import { DropShadowFilter } from "pixi-filters";
import followSound from "../assets/follow.wav";

import { addToPixiLoader } from "../utils.js";

PIXI.Loader.registerPlugin(WebfontLoaderPlugin);
gsap.registerPlugin(PixiPlugin);

const app = new PIXI.Application({
  width: 500,
  height: 220,
  backgroundAlpha: 0,
});

const stage = new PIXI.Container();
let graphics;
let followText;

// TODO: preload sound + video
const audio = new Audio(followSound);

export default {
  name: "alert-follow-Filou",
  inject: ["followEvent"],
  watch: {
    followEvent() {
      this.drawFollowEvent();
    },
  },
  methods: {
    drawFollowEvent() {
      // update the text from the event
      followText.text = ` Bienvenue ${this.followEvent.user_name}! `;

      gsap.set(graphics, { width: 1 });
      gsap.set(followText, { y: 220 / 2 });

      this.$refs.video.play();
      gsap.to(this.$refs.notification, {
        duration: 1.5,
        y: 25, // appearing from the top
        repeat: 1, // we repeat only once
        repeatDelay: 4, // how long it stays on the screen
        yoyo: true, // yoyo = repeat the animation but reverse
        ease: Elastic.easeOut.config(1, 0.3),
      });

      // Animate mask to reveal the text
      gsap.to(graphics, {
        duration: 1.9,
        width: 500,
        delay: 1.95,
      });

      gsap.to(followText, {
        duration: 5,
        y: -179,
        delay: 5,
        ease: Elastic.easeOut.config(1, 0.3),
      });

      audio.play();
    },
  },
  async mounted() {
    this.$refs.video.pause();
    gsap.set(this.$refs.notification, { y: -525 });

    await addToPixiLoader(app, "https://fonts.googleapis.com/css2?family=Bangers");

    followText = new PIXI.Text("Bienvenue Jean Michel!", {
      fontFamily: "Bangers",
      fontSize: 38,
      fontWeight: "400",
      letterSpacing: 2,
      fill: 0xffffff,
      wordWrap: false,
      align: "center",
    });

    followText.anchor.set(0.5);
    followText.x = 500 / 2;
    followText.y = 220 / 2;

    const filterDropshadow = new DropShadowFilter();
    followText.filters = [filterDropshadow];

    stage.addChild(followText);

    this.$refs.canvas.appendChild(app.view);
    app.stage.addChild(stage);

    graphics = new PIXI.Graphics();

    // MASK
    graphics.beginFill(0xde3249);
    graphics.drawRect(0, 0, 1, 500);
    graphics.endFill();

    followText.mask = graphics;

    stage.addChild(graphics);
  },
};
</script>

<template>
  <div class="follow-filou">
    <div class="follow-filou__notification" ref="notification">
      <div class="follow-filou__container">
        <div class="follow-filou__canvas" ref="canvas"></div>
        <video autoplay muted src="/src/assets/filou.mp4" ref="video"></video>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.follow-filou {
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
