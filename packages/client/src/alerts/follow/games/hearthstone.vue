<script>
import * as PIXI from "pixi.js";
import { gsap } from "gsap";

import { WebfontLoaderPlugin } from "pixi-webfont-loader";
import followSound from "@/assets/sounds/follow.wav";
import { addToPixiLoader } from "@/lib/utils";

PIXI.Loader.registerPlugin(WebfontLoaderPlugin);

import backgroundImage from "@/assets/hs/background.png";
import mathCatImage from "@/assets/hs/mathcat.png";
import careBearImage from "@/assets/hs/carebear.png";
import oraclemouseImage from "@/assets/hs/oraclemouse.png";
import tavernOneImage from "@/assets/hs/tavern/t1.png";
import tavernTwoImage from "@/assets/hs/tavern/t2.png";
import tavernThreeImage from "@/assets/hs/tavern/t3.png";

// Pixi variables
let size = {
  width: 400,
  height: 570,
};
let app = null;
let stage = null;
let userText = null;
let titleText = null;
let paragraphText = null;
let attackText = null;
let healthText = null;
let texture = null;
let background = null;
let artworks = [mathCatImage, careBearImage, oraclemouseImage];
let artwork = null;
let taverns = [tavernOneImage, tavernTwoImage, tavernThreeImage];
let tavern = null;
let numberFontStyle = null;

let audio = null;
let tl;
let index;
let events;

export default {
  name: "alert-follow-hearthstone",
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
      userText.text = ` ${this.followEvent.user_name.toUpperCase()}`;

      audio.play();

      console.log(index, " debug queue event timestamp: ", event.timestamp, event.user_name);
      index++;
    },
    onAnimationComplete() {
      // reset some states?
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
      width: size.width,
      height: size.height,
      backgroundAlpha: 0,
    });

    stage = new PIXI.Container();

    // TODO: preload sound
    audio = new Audio(followSound);
    audio.volume = 0.35;

    // gsap.set(this.$refs.notification, { y: -525 });

    // Create a new texture
    texture = PIXI.Texture.from(artworks[Math.floor(Math.random() * artworks.length)]);
    artwork = new PIXI.Sprite(texture);
    artwork.anchor.set(0.5);
    artwork.x = size.width / 2;
    artwork.y = size.height / 2;

    const mask = new PIXI.Graphics();
    mask.beginFill(0x000000);
    // 230 = width of card window 315 = height of card window
    mask.drawEllipse(size.width / 2 + 8, 315 / 2 + 30, 230 / 2, 315 / 2);
    mask.endFill();
    artwork.mask = mask;

    stage.addChild(artwork);

    texture = PIXI.Texture.from(backgroundImage);
    background = new PIXI.Sprite(texture);

    background.anchor.set(0.5);
    background.x = size.width / 2;
    background.y = size.height / 2;

    stage.addChild(background);

    texture = PIXI.Texture.from(taverns[Math.floor(Math.random() * taverns.length)]);
    tavern = new PIXI.Sprite(texture);

    tavern.anchor.set(0.5);
    tavern.x = size.width / 2;
    tavern.y = size.height / 2;

    stage.addChild(tavern);

    await addToPixiLoader(app, "Belwe", "/fonts/Belwe.ttf");
    userText = new PIXI.Text("testFromUser", {
      fontFamily: "Belwe",
      fill: "#ffffff",
      fontSize: 30,
      strokeThickness: 6,
    });

    userText.anchor.set(0.5);
    userText.x = size.width / 2;
    userText.y = size.height / 2 + 20;

    stage.addChild(userText);

    await addToPixiLoader(app, "FranklinMedium", "/fonts/FranklinMedium.otf");
    titleText = new PIXI.Text("Râle d'agonie:", {
      fontFamily: "FranklinMedium",
      fill: "#1c1209",
      fontSize: 24,
    });

    titleText.anchor.set(0.5);
    titleText.x = size.width / 2;
    titleText.y = size.height / 2 + 130;

    stage.addChild(titleText);

    await addToPixiLoader(app, "FranklinRegular", "/fonts/FranklinRegular.ttf");
    paragraphText = new PIXI.Text("meurt", {
      fontFamily: "FranklinRegular",
      fill: "#1c1209",
      fontSize: 24,
    });

    paragraphText.anchor.set(0.5);
    paragraphText.x = size.width / 2;
    paragraphText.y = size.height / 2 + 160;

    stage.addChild(paragraphText);

    numberFontStyle = new PIXI.TextStyle({
      fontFamily: "Belwe",
      fill: "#ffffff",
      fontSize: 82,
      strokeThickness: 6,
    });

    attackText = new PIXI.Text(Math.floor(Math.random() * 10), numberFontStyle);

    attackText.anchor.set(0.5);
    attackText.x = 65;
    attackText.y = size.height - 60;

    stage.addChild(attackText);

    healthText = new PIXI.Text(Math.floor(Math.random() * 10), numberFontStyle);

    healthText.anchor.set(0.5);
    healthText.x = size.width - 48;
    healthText.y = size.height - 60;

    stage.addChild(healthText);

    this.$refs.canvas.appendChild(app.view);
    app.stage.addChild(stage);
  },
  unmounted() {
    // this is important for performance reason probably, for once :D
    app.destroy(true, { children: true });
    stage = null;
    userText = null;
    titleText = null;
    paragraphText = null;
    attackText = null;
    healthText = null;
    texture = null;
    background = null;
    artwork = null;
    tavern = null;
    numberFontStyle = null;

    audio = null;

    tl.kill();
    index = 0;
    events = [];
  },
};
</script>

<template>
  <div class="follow-hearthstone">
    <div class="follow-hearthstone__notification" ref="notification">
      <div class="follow-hearthstone__container">
        <div class="follow-hearthstone__canvas" ref="canvas"></div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.follow-hearthstone {
  width: 100%;
  height: 100%;

  &__notification {
    position: absolute;
    top: 25px;
    left: 25px;
    width: 400px;
    height: 570px;
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
