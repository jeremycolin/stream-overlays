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
const artworks = [PIXI.Texture.from(mathCatImage), PIXI.Texture.from(careBearImage), PIXI.Texture.from(oraclemouseImage)];
let artwork = null;
const taverns = [PIXI.Texture.from(tavernOneImage), PIXI.Texture.from(tavernTwoImage), PIXI.Texture.from(tavernThreeImage)];
const fakeUsers = ["Squeezie", "Zerator", "Pokimane", "Domingo", "Unusualspoon", "PewDiePie", "Théotar", "Amouranth"];
let tavern = null;
let numberFontStyle = null;

let audio = null;
let tl;
let index;
let events;

export default {
  name: "alert-follow-hearthstone",
  inject: ["followEvent"],
  data() {
    return {
      isDev: IS_DEV,
      username: "",
      // we assume 17 characters are able to fit, this part could be reworked with the computation of real length
      // because the number of characters that can actually fit depends on characters withs
      usernameMaxLength: 17,
    };
  },
  computed: {
    // limit number of characters for the username
    clampedUsername() {
      return this.username.substring(this.username, this.usernameMaxLength);
    },
    // offset the username so it appears centered
    startOffset() {
      return `${(1 - this.clampedUsername.length / this.usernameMaxLength) * 50}%`;
    },
  },
  watch: {
    followEvent(newVal) {
      console.log(newVal);
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
        duration: 0.3,
        x: -size.width / 2 + size.width / 4 + 30, // appearing from the left
        repeat: 1, // we repeat only once
        repeatDelay: 2, // how long it stays on the screen
        yoyo: true, // yoyo = repeat the animation but reverse
        ease: "ease-out",
        onStart: this.onAnimationStart,
        onComplete: this.onAnimationComplete,
      });
    },
    onAnimationStart() {
      const event = events[index];
      this.username = this.followEvent.user_name;
      this.randomizeCard();
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
    randomizeCard() {
      if (this.isDev) this.username = fakeUsers[Math.floor(Math.random() * fakeUsers.length)];

      artwork.texture = artworks[Math.floor(Math.random() * artworks.length)];
      tavern.texture = taverns[Math.floor(Math.random() * taverns.length)];

      attackText.text = Math.floor(Math.random() * 10);
      healthText.text = Math.floor(Math.random() * 10);
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

    gsap.set(this.$refs.notification, { x: -size.width });

    // Create a new texture
    artwork = new PIXI.Sprite(artworks[Math.floor(Math.random() * artworks.length)]);
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

    tavern = new PIXI.Sprite(taverns[Math.floor(Math.random() * taverns.length)]);
    tavern.anchor.set(0.5);
    tavern.x = size.width / 2;
    tavern.y = size.height / 2;

    stage.addChild(tavern);

    await addToPixiLoader(app, "Belwe", "/fonts/Belwe.ttf");

    this.username = "testFromUser";

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
        <svg class="svg" viewBox="0 0 300 60">
          <defs>
            <!-- defines the gradient for the fade mask -->
            <linearGradient id="svgFadeGradient">
              <stop stop-color="black" offset="0%" />
              <stop stop-color="white" offset="3%" />
              <stop stop-color="white" offset="97%" />
              <stop stop-color="black" offset="100%" />
            </linearGradient>
          </defs>
          <!-- 1. curve: define the bezier curve the Text will follow -->
          <path
            id="svgCurve"
            fill="none"
            stroke="none"
            d="m0,22.12s12.48,7.37,67-5C111.1,7.11,174.62-1.11,213,.12c43.98,1.42,52,7,68,14"
            transform="translate(10 25)"
          />
          <!--
            2. text: define and display the Text
            - textPath will make it follow the curve
          -->
          <text id="svgText" x="0" y="0" mask="url(#fade)">
            <!-- 2.1. textPath: follow the curve -->
            <textPath xlink:href="#svgCurve" :startOffset="startOffset" v-text="clampedUsername"></textPath>
          </text>
          <!--
            3. Stroke: it is not possible to add "outer" stroke so we need to add a trick to achieve it
            - apply stroke width with the double of expected amount (6 instead of 3)
            - a mask with the size of the SVG (white to hide) that will only show the Text without the stroke (black to reveal)
          -->
          <use xlink:href="#svgText" stroke-width="6" stroke="black" fill="none" mask="url(#svgTextStrokeOnly)" />
          <mask id="svgTextStrokeOnly">
            <rect x="0" y="0" width="300" height="60" fill="white" />
            <use xlink:href="#svgText" fill="black" />
          </mask>
          <!-- 4. Mask: mask the text outside of the SVG with a slight fade -->
          <mask maskUnits="userSpaceOnUse" id="fade">
            <rect fill="url(#svgFadeGradient)" width="100%" height="100%" />
          </mask>
        </svg>
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
    bottom: 0;
    left: 10px;
    width: 400px;
    height: 570px;
    overflow: hidden;
    z-index: 10;
  }

  &__container {
    position: relative;
    width: 100%;
    height: 100%;
    transform: scale(65%);
  }

  &__canvas {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 10;
  }
  svg {
    position: absolute;
    z-index: 11;
    top: 290px;
    left: 55px;
    width: 300px;
    height: 60px;
    font-family: "Belwe";
    fill: #ffffff;
    font-size: 30px;
  }
}
</style>
