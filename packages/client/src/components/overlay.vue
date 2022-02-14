<script>
import * as PIXI from 'pixi.js';
import { gsap, Elastic } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin.js";
import { WebfontLoaderPlugin } from "pixi-webfont-loader";

PIXI.Loader.registerPlugin(WebfontLoaderPlugin);
gsap.registerPlugin(PixiPlugin);

const app = new PIXI.Application({
  width: 500,
  height: 281,
  backgroundAlpha: 0
})

const stage = new PIXI.Container();
let graphics
let followText

// TODO: preload sound + video
var audio = new Audio('/src/assets/follow.wav');

export default {
  name: 'overlay',
  data () {
    return {
      animate: false
    }
  },
  inject: ['followEvent'],
  watch: {
    followEvent() {
      this.drawFollowEvent();
    }
  },
  methods: {
    drawFollowEvent() {
      // TODO: update the text from the event
      gsap.set(graphics, {
        width: 1
      });

      this.$refs.video.play()
      gsap.to(this.$refs.notification, 1.5, {
        y: 25, // appearing from the top
        repeat: 1, // we repeat only once 
        repeatDelay: 4, // how long it stays on the screen
        yoyo: true, // yoyo = repeat the animation but reverse
        ease: Elastic.easeOut.config(1, 0.3)
      });

      // Animate mask to reveal the text
      gsap.to(graphics, 1.9, {
        width: 500,
        delay: 1.95
      });

      audio.play();
    },
  },
  mounted () {
    this.$refs.video.pause()
    gsap.set(this.$refs.notification, { y: -525 });

    // Load directly from google CSS!
    app.loader.add({ name: 'From Google 1', url: 'https://fonts.googleapis.com/css2?family=Roboto' });
    app.loader.load(() => {

      followText = new PIXI.Text('Bienvenue Jean Michel!', {
        fontFamily: 'Roboto',
        fontSize: 34,
        fontWeight: 'bold',
        fill : 0xffffff
      });

      followText.anchor.set(0.5);
      followText.x = 500 / 2;
      followText.y = 281 / 2;

      stage.addChild(followText);

      this.$refs.canvas.appendChild(app.view);
      app.stage.addChild(stage);

      graphics = new PIXI.Graphics();

      // MASK
      graphics.beginFill(0xDE3249);
      graphics.drawRect(0, 100, 1, 100);
      graphics.endFill();

      followText.mask = graphics;

      stage.addChild(graphics);
    });
  }
}
</script>

<template>
  <div class="overlay">
    <div class="overlay__notification" ref="notification">
      <div class="overlay__container">
        <div class="overlay__canvas" ref="canvas"></div>
        <video autoplay muted src="/src/assets/filou.mp4" ref="video"></video>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.overlay {
  width: 1920px;
  height: 1080px;

  &__notification {
    position: absolute;
    top: 25px;
    left: 25px;
    width: 500px;
    height: 281px;
    border-radius: 10px;
    overflow:hidden;

    video {
      position: absolute;
      top: 0;
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
