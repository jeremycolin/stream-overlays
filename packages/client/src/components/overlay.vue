<script>
import * as PIXI from 'pixi.js';
import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin.js";
import { GlitchFilter } from 'pixi-filters';

gsap.registerPlugin(PixiPlugin);

const app = new PIXI.Application({
  width: 1920,
  height: 1080,
  backgroundAlpha: 0
})

const stage = new PIXI.Container();
let followText

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
      this.drawFollowEvent()
    }
  },
  methods: {
    drawFollowEvent () {
      followText.text = `${this.followEvent.type} : ${this.followEvent.user_name}`;

      followText.x = 25;
      followText.y = -25;

      gsap.to(followText, 0.5, {
        y: 30, // appearing from the top
        repeat: 1, // we repeat only once 
        repeatDelay: 7, // how long it stays on the screen
        yoyo: true, // yoyo = repeat the animation but reverse
      });

      stage.addChild(followText);
    }
  },
  mounted () {
    this.$el.appendChild(app.view);
    app.stage.addChild(stage);
    let renderer = PIXI.autoDetectRenderer();

    let ticker = PIXI.Ticker.shared;
    ticker.add((time) => {
      renderer.render(stage);
      filterGlitch.seed = Math.random();
      filterGlitch.offset = Math.random() * (Math.random() + 2);
    });

    followText = new PIXI.Text('user_name', {
      fontFamily : 'Arial',
      fontSize: 24,
      fill : 0xffffff
    });

    const filterGlitch = new GlitchFilter()
    followText.filters = [filterGlitch];
  }
}
</script>

<template>
<div class="overlay">
</div>
</template>

<style lang="scss">
.overlay {
  width: 1920px;
  height: 1080px;
  border: 1px solid black;
}
</style>
