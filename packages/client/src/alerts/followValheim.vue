<script>
import { gsap } from "gsap";

const lastName = ["Freyrson", "Reidunson", "Bergunnson", "Trondson", "Odinson"];

const title = ["The Thief of Piece", "The Famous Wolf", "The Ruler", "The Victorious Protector", "The Wise"];

let tl;
let index;
let events;

export default {
  name: "alert-follow-Valheim",
  data() {
    return {
      userName: "Askowbol",
    };
  },
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
      const tl = gsap.timeline({
        onStart: this.onAnimationStart,
      });
      tl.to(this.$refs.notification, {
        duration: 1.5,
        autoAlpha: 1,
      });
      tl.to(this.$refs.norseText, {
        duration: 1.5,
        autoAlpha: 0,
        delay: 1,
      });
      tl.to(this.$refs.text, {
        duration: 1,
        autoAlpha: 1,
      });
      tl.to(this.$refs.notification, {
        duration: 1.5,
        autoAlpha: 0,
        delay: 4,
      });
      tl.set(this.$refs.text, { autoAlpha: 0 }); // reset state of text for next animation
      tl.set(this.$refs.norseText, { autoAlpha: 1 }); // reset state of text for next animation
      return tl;
    },
    onAnimationStart() {
      const event = events[index];
      const randomLastName = lastName[Math.floor(Math.random() * lastName.length)];
      const randomTitle = title[Math.floor(Math.random() * title.length)];

      this.userName = `${randomTitle} ${event.user_name} ${randomLastName}`;

      console.log(index, " debug queue event timestamp: ", event.timestamp, event.user_name);
      index++;
    },
    onQueueComplete() {
      tl.clear();
      events = [];
      index = 0;
    },
  },
  mounted() {
    gsap.set(this.$refs.notification, { autoAlpha: 0 });
    gsap.set(this.$refs.norseText, { autoAlpha: 1 });
    gsap.set(this.$refs.text, { autoAlpha: 0 });
    tl = gsap.timeline({
      onComplete: this.onQueueComplete,
    });
    tl.pause();
    events = [];
    index = 0;
  },
  unmounted() {
    tl.kill();
    index = 0;
    events = [];
  },
};
</script>

<template>
  <div class="follow-valheim">
    <div class="follow-valheim__notification" ref="notification">
      <div class="follow-valheim__container">
        <div class="follow-valheim__content follow-valheim__content--norse" ref="norseText">
          ᛅᛁᚦ᛬​ᛅᛏ᛬​ᛁᚢᛚᚢᛘ᛬​ᚴᚢᚱᚦᚢᛋᚴ᛬​ᛘᛁᚾ᛬​ᚦᛅᚱ᛬​ᚢᚴᛅᛏᛁᚱ ᚢᚴ᛬​ᛋᛁᛘ᛬​ᛚᛅᛁᚦ᛬​ᛅᛏ᛬​ᛁᚢᛚᚢᛘ᛬​ᚴᚢᚱᚦᚢᛋᚴ᛬​ᛘᛁᚾ᛬​ᚦᛅᚱ᛬​
        </div>
        <div class="follow-valheim__content" ref="text">{{ userName }} is ready to fight for Valhalla !</div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.follow-valheim {
  width: 100%;
  height: 100%;

  &__notification {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 50vw;
    height: 50vh;
    transform: translate(-50%, -50%);
    overflow: hidden;
    z-index: 10;
  }

  &__container {
    position: relative;
    width: 100%;
    height: 100%;
    text-align: center;
    /* Created with https://www.css-gradient.com */
    background: #000000;
    background: radial-gradient(ellipse farthest-side at center center, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.5) 35%, #ffffff00 66%);
  }

  &__content {
    font-family: "Skranji", cursive;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    width: 35%;
    margin: auto;
    // text-transform: uppercase;
    color: #c74d47;
    font-size: 24px;
    -webkit-text-stroke: 1px #000;
    z-index: 5;
    line-height: 2;
    letter-spacing: 1px;

    &--norse {
      font-size: 32px;
      line-height: 1.5;
      font-family: "Noto Sans Runic", sans-serif;
    }
  }
}
</style>
