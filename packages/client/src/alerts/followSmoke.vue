<script>
import * as PIXI from "pixi.js";
import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin.js";
import { WebfontLoaderPlugin } from "pixi-webfont-loader";
import { DropShadowFilter } from "pixi-filters";

import backgroundUrl from "@/assets/background-askowbol.jpg";
import maskUrl from "@/assets/mask/smoke-1.mp4";
import maskImageUrl from "@/assets/mask/mask.jpg";

import { addToPixiLoader } from "@/utils.js";

PIXI.Loader.registerPlugin(WebfontLoaderPlugin);
gsap.registerPlugin(PixiPlugin);

// notification settings
const notification = {
  width: 500,
  height: 374,
};

// Pixi variables
let app = null;
let stage;
let animationStage;
let Mask;
let followText;
let videoTexture;
let videoSprite;
let video;
let filterDropshadow;

let events;
let index;
export default {
  name: "alert-follow-smoke",
  inject: ["followEvent"],
  watch: {
    followEvent(newVal) {
      if (newVal) {
        events.push(newVal);
        this.startAnimation();
      }
    },
  },
  methods: {
    startAnimation() {
      const event = events[index];
      followText.text = `${event.user_name.toUpperCase()}!`;
      gsap.set(animationStage, { alpha: 1 });
      video.play();

      index++;
    },
    onVideoEnd() {
      gsap.to(animationStage, { duration: 1, alpha: 0, delay: 3, onComplete: this.onAnimationEnd });
    },
    onAnimationEnd() {
      video.currentTime = 0.1;
      gsap.set(animationStage, { alpha: 0 });
    },
  },
  async mounted() {
    events = [];
    index = 0;
    app = new PIXI.Application({
      width: notification.width,
      height: notification.height,
      backgroundAlpha: 0,
    });

    stage = new PIXI.Container();
    animationStage = new PIXI.Container();

    await addToPixiLoader(app, "https://fonts.googleapis.com/css2?family=Sue+Ellen+Francisco");

    followText = new PIXI.Text("Bienvenue Jean Michel!", {
      fontFamily: "Sue Ellen Francisco",
      fontSize: 48,
      fontWeight: "400",
      letterSpacing: 4,
      fill: 0xffffff,
      wordWrap: false,
      align: "center",
      padding: 10,
    });

    followText.anchor.set(0.5);
    followText.x = notification.width / 2;
    followText.y = notification.height / 2;

    filterDropshadow = new DropShadowFilter();
    followText.filters = [filterDropshadow];

    animationStage.addChild(followText);

    const textureBg = PIXI.Texture.from(backgroundUrl);
    const background = new PIXI.Sprite(textureBg);
    background.width = notification.width;
    background.height = notification.height;

    animationStage.addChild(background);
    animationStage.addChild(followText);

    const textureBgMask = PIXI.Texture.from(maskImageUrl);
    Mask = new PIXI.Sprite(textureBgMask);
    Mask.width = notification.width;
    Mask.height = notification.height;

    background.mask = Mask;
    animationStage.addChild(Mask);

    app.stage.addChild(animationStage);
    app.stage.addChild(stage);

    gsap.set(animationStage, { alpha: 0 });

    videoTexture = PIXI.Texture.from(maskUrl);
    videoSprite = new PIXI.Sprite(videoTexture);
    videoTexture.baseTexture.resource.autoPlay = false;

    videoSprite.width = notification.width;
    videoSprite.height = notification.height;

    video = videoTexture.baseTexture.resource.source;
    video.muted = true;
    video.onended = this.onVideoEnd;

    stage.addChild(videoSprite);

    animationStage.mask = videoSprite;

    this.$refs.canvas.appendChild(app.view);
  },
  unmounted() {
    app.destroy(true, { children: true });
    stage = null;
    events = null;
    animationStage = null;
    Mask = null;
    followText = null;
    videoTexture = null;
    videoSprite = null;
    video = null;
    filterDropshadow = null;
    index = 0;
    events = [];
  },
};
</script>

<template>
  <div class="follow-smoke">
    <div class="follow-smoke__notification" ref="notification">
      <div class="follow-smoke__container">
        <div class="follow-smoke__canvas" ref="canvas"></div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.follow-smoke {
  width: 100%;
  height: 100%;

  button {
    position: absolute;
    top: 50%;
    left: 50%;
  }

  &__notification {
    position: absolute;
    top: 25px;
    left: 25px;
    width: 500px;
    height: 374px;
    overflow: hidden;
    z-index: 10;
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
