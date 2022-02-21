<script>
import * as PIXI from "pixi.js";
import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin.js";
import { WebfontLoaderPlugin } from "pixi-webfont-loader";
import followSound from "@/assets/sounds/sot2.mp3";

import { addToPixiLoader } from "@/utils.js";

PIXI.Loader.registerPlugin(WebfontLoaderPlugin);
gsap.registerPlugin(PixiPlugin);

// Pixi variables
let app = null;
let stage = null;
let graphics = null;
let followText;

let audio = null;
let tl;
let index;
let events;

// notification settings
const notification = {
  width: 630,
  height: 130,
};

const polygon = [
  {
    path: [
      609.5, 33.5, 609.5, 50.8, 605.5, 54.5, 609.5, 58.4, 609.5, 70.6, 595.5, 74.5, 596.5, 75.5, 608.5, 76.5, 608.5, 90.5, 586.5, 90.5,
      584.5, 89.5, 579.5, 91.5, 445.5, 92.5, 441.5, 89.5, 429.8, 92.5, 342.4, 92.5, 334.5, 90.5, 332.5, 90.5, 332.5, 92.5, 207.7, 92.5,
      198.5, 90.5, 191.5, 90.5, 191.5, 92.5, 156.1, 92.5, 154.5, 91.5, 148.5, 91.5, 146.9, 92.5, 124.8, 92.5, 120.5, 96.5, 114.5, 102.5,
      108.5, 105.5, 98.5, 111.5, 89.5, 114.5, 80.5, 115.5, 67.6, 115.5, 60.5, 114.5, 54.5, 113.5, 48.5, 108.5, 45.5, 106.5, 43.5, 102.5,
      40.5, 100.5, 34.5, 92.5, 21.5, 91.5, 21.5, 83.6, 23.5, 75.5, 20.6, 74.5, 20.5, 53.5, 28.5, 49.5, 20.5, 44.9, 20.5, 33.5, 35.3, 33.5,
      41.5, 27.5, 48.5, 23.5, 56.5, 18.5, 63.5, 16.5, 75.5, 16.5, 87.5, 17.5, 98.5, 19.5, 122.5, 33.5, 197.5, 32.5, 201.5, 35.5, 203.5,
      32.5, 302.5, 33.5, 306.5, 35.5, 310.5, 33.5, 386.5, 33.5, 391.5, 37.5, 396.5, 33.5, 442.5, 33.5, 443.5, 35.5, 479.5, 35.5, 506.5,
      33.5, 527.5, 33.5, 544.5, 32.5, 575.5, 32.5, 575.5, 34.5, 589.5, 34.5, 589.5, 35.5, 593.5, 35.5, 594.5, 33.5,
    ],
    fill: "0x000000",
  },
  {
    path: [
      51.5, 88.5, 57.5, 92.5, 63.5, 94.5, 69.1, 94.5, 70.5, 99.5, 74.5, 102.5, 76.8, 102.5, 80.5, 100.5, 83.8, 95.5, 92.5, 93.5, 97.5, 91.5,
      101, 88.5, 103.5, 91.5, 106.5, 94.5, 103.5, 97.5, 100.8, 95.5, 99.5, 96.5, 100.5, 100.5, 88.5, 105.5, 76.5, 106.5, 66.5, 105.5, 55.5,
      102.5, 48.5, 98.5, 44.5, 94.5,
    ],
    fill: "0x807b2b",
  },
  {
    path: [
      104.5, 85.5, 107.5, 90.5, 113, 88.5, 118, 88.5, 118, 86.3, 115.5, 84.5, 115.5, 79.5, 109.5, 79.5, 103.5, 82.5, 100.5, 83.5, 100, 85,
    ],
    fill: "0x807b2b",
  },
  {
    path: [
      112.3, 76, 115.5, 72.5, 118, 68.1, 118.5, 59.5, 114.5, 50.5, 110.5, 49.5, 110.5, 52.8, 112.5, 57.5, 113.5, 59.5, 113.5, 67.5, 111.5,
      69.5, 111.5, 72.5, 111.4, 76,
    ],
    fill: "0x807b2b",
  },
  {
    path: [
      103.5, 37.5, 107.5, 39.5, 112.6, 39.5, 114.5, 41.5, 114.5, 42.5, 111.4, 42.5, 111.5, 44.5, 114.5, 44.5, 113.5, 47.5, 106.5, 47.5,
      96.5, 41.5, 96.5, 39.9, 97.5, 39.5, 100, 40.4,
    ],
    fill: "0x807b2b",
  },
  {
    path: [100, 36.9, 104.5, 32.5, 99.5, 28.5, 95.5, 26.5, 91, 26.5, 91, 32.4, 94.5, 33.5, 97.3, 36.9],
    fill: "0x807b2b",
  },
  {
    path: [71.5, 96.5, 74.5, 99.5, 77, 99.5, 80.5, 95.5, 80.5, 93.8, 77.7, 90.5, 74.8, 90.5, 71.5, 94.1],
    fill: "0xd2c444",
  },
  {
    path: [
      36.5, 89.5, 42, 89.5, 44.5, 91.5, 48.5, 86.5, 51.8, 86.5, 52.5, 87.5, 54.5, 87.5, 54.5, 85.7, 47.5, 80.5, 39.9, 80.5, 40.1, 85, 38,
      86, 36.5, 86.6,
    ],
    fill: "0x807b2b",
  },
  {
    path: [
      40.5, 50.5, 43.5, 50.5, 41.5, 56.5, 39.5, 59.5, 39.5, 68.5, 40.5, 71.5, 41.5, 73.5, 42.6, 76, 39.5, 76, 35.5, 69.5, 35.5, 59.5, 36.5,
      57.5, 37.5, 53.5, 38.1, 50.5,
    ],
    fill: "0x807b2b",
  },
  {
    path: [
      36.5, 48.9, 43.5, 48.9, 51.5, 43.5, 54.1, 42.5, 53.5, 40.5, 50.3, 40.5, 47.5, 36.5, 45.3, 36.5, 44.5, 38, 39.5, 41.3, 35.5, 41.2,
      35.5, 42.7, 37.3, 42.7, 37.4, 47.5,
    ],
    fill: "0x807b2b",
  },
  {
    path: [56.5, 34.5, 62.5, 34.5, 61.5, 25.5, 57.5, 26.5, 52.5, 28.5, 48.5, 31.5, 47.5, 32.5, 49.5, 35.5, 51.5, 38.5, 54.5, 38, 55, 36.5],
    fill: "0x807b2b",
  },
  {
    path: [65.8, 35, 87.7, 35, 87.7, 32.6, 65.3, 32.6],
    fill: "0x807b2b",
  },
  {
    path: [65.3, 30.5, 87.7, 30.5, 87.7, 22.8, 83.5, 26.5, 81.2, 26.7, 76, 20.4, 74.2, 20.4, 70.5, 26.5, 67.8, 26.5, 65.3, 23.8],
    fill: "0x807b2b",
  },
  {
    path: [52, 62, 57.2, 62, 57, 56, 60.5, 56, 59.9, 62, 64.7, 62, 65.3, 64.8, 60.6, 64.8, 60, 70, 57.2, 70, 57, 65, 52, 65.1, 52, 62.8],
    fill: "0xd2c444",
  },
  {
    path: [72, 59, 69, 56, 78.7, 48.9, 83, 48.9, 83, 76.8, 89, 76.8, 89, 80.5, 75.1, 80.5, 74.2, 76, 79, 76.4, 79, 52.9],
    fill: "0xd2c444",
  },
];

export default {
  name: "alert-follow-sot",
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
        duration: 0.75,
        y: 0,
        alpha: 1, // Fade In
        repeat: 1, // we repeat only once
        repeatDelay: 2, // how long it stays on the screen
        yoyo: true, // yoyo = repeat the animation but reverse
        onStart: this.onAnimationStart,
      });
    },
    onAnimationStart() {
      const event = events[index];
      followText.text = `${this.followEvent.user_name} rejoint l'équipage!`;

      audio.play();
      console.log(index, " debug queue event timestamp: ", event.timestamp, event.user_name);
      index++;
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
    audio = new Audio(followSound);
    audio.volume = 0.75;

    gsap.set(this.$refs.notification, { alpha: 0, y: -30 });

    app = new PIXI.Application({
      width: notification.width,
      height: notification.height,
      backgroundAlpha: 0,
      antialias: true,
      autoDensity: true,
    });

    stage = new PIXI.Container();

    this.$refs.canvas.appendChild(app.view);
    app.stage.addChild(stage);

    await addToPixiLoader(app, "https://fonts.googleapis.com/css2?family=Sawarabi+Mincho");

    graphics = new PIXI.Graphics();

    polygon.forEach((path) => {
      graphics.lineStyle(0);
      graphics.beginFill(path.fill, 1);
      graphics.drawPolygon(path.path);
      graphics.endFill();
    });

    stage.addChild(graphics);

    followText = new PIXI.Text("Askowbol rejoint l'équipage!", {
      fontFamily: "Sawarabi Mincho",
      fontSize: 20,
      fontWeight: "400",
      letterSpacing: 2,
      fill: 0xdfdfd5,
      wordWrap: false,
      align: "center",
      padding: 10,
    });

    followText.anchor.set(0.5, 0.5);
    followText.x = 360;
    followText.y = 61;

    stage.addChild(followText);
  },
  unmounted() {
    app.destroy(true, { children: true });
    stage = null;
    graphics = null;
    followText = null;

    audio = null;
    tl.kill();
    index = 0;
    events = [];
  },
};
</script>

<template>
  <div class="follow-sot">
    <div class="follow-sot__notification" ref="notification">
      <div class="follow-sot__container">
        <div class="follow-sot__canvas" ref="canvas"></div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.follow-sot {
  width: 100%;
  height: 100%;

  &__notification {
    position: absolute;
    top: 25px;
    left: 50%;
    width: 630px;
    height: 130px;
    transform: translate(-50%);
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
