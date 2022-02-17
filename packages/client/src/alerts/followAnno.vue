<script>
import { gsap } from "gsap";

import avatarOne from "@/assets/anno/Beryl_O'Mara.png";
import avatarTwo from "@/assets/anno/Carl_Leonard_von_Malching.png";
import avatarThree from "@/assets/anno/George_Smith.png";

const avatar = [
  {
    src: avatarOne,
    title: "O'mara",
  },
  {
    src: avatarTwo,
    title: "Von Malching",
  },
  {
    src: avatarThree,
    title: "Smith",
  },
];

let tl;
let index;
let events;

export default {
  name: "alert-follow-Anno",
  data() {
    return {
      userName: "Askowbol",
      avatarSrc: "",
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
      return gsap.to(this.$refs.notification, {
        duration: 0.5,
        x: -15, // appearing from the right
        repeat: 1, // we repeat only once
        repeatDelay: 4, // how long it stays on the screen
        yoyo: true, // yoyo = repeat the animation but reverse
        onStart: this.onAnimationStart,
      });
    },
    onAnimationStart() {
      const event = events[index];
      const randomAvatar = avatar[Math.floor(Math.random() * avatar.length)];

      this.avatarSrc = randomAvatar.src;
      this.userName = `${event.user_name} ${randomAvatar.title}`;

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
    gsap.set(this.$refs.notification, { x: "+=110%" });
    tl = gsap.timeline({
      onComplete: this.onQueueComplete,
    });
    tl.pause();
    events = [];
    index = 0;
  },
  unmounted() {
    tl = null;
    index = 0;
    events = [];
  },
};
</script>

<template>
  <div class="follow-anno">
    <div class="follow-anno__notification" ref="notification">
      <div class="follow-anno__container">
        <img :src="avatarSrc" alt="avatar" />
        <div class="follow-anno__username">
          {{ userName }}
        </div>
        <div class="follow-anno__content">viens de nous rejoindre !</div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.follow-anno {
  width: 100%;
  height: 100%;

  &__notification {
    position: absolute;
    top: 500px;
    right: 25px;
    width: 256px;
    overflow: hidden;
    z-index: 10;
  }

  &__container {
    position: relative;
    width: 100%;
    height: 100%;
    text-align: center;
  }

  &__username {
    position: relative;
    background: #3c2d4c;
    color: #edd8ad;
    padding: 10px;
    border-radius: 5px;
    margin-top: -40px;
    z-index: 10;
  }

  &__content {
    position: relative;
    width: 95%;
    margin: auto;
    background: #edd8ad;
    color: #403016;
    padding: 30px 60px;
    border-bottom-right-radius: 5px;
    border-bottom-left-radius: 5px;
    z-index: 5;
  }
}
</style>
