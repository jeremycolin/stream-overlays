<script>
import Experience from "@/three/experiences/home/Experience.js";

export default {
  name: "app-home",
  mounted() {
    const experience = new Experience(this.$refs.canvas);
  },
};
</script>

<template>
  <div class="home generic-background">
    <canvas ref="canvas" class="webgl"></canvas>
    <span class="title title-front">Stream Overlay</span>
    <span class="title title-back">Stream Overlay</span>
    <footer>
      <ul>
        <li><a href="https://github.com/jeremycolin/stream-overlays">code</a></li>
      </ul>
    </footer>
  </div>
</template>

<style lang="scss">
.home {
  position: relative;
  display: flex;
  width: 100%;
  height: 100%;
  color: #ffffff;

  .webgl {
    position: fixed;
    top: 0;
    left: 0;
    outline: none;
    z-index: 10;
  }

  .title {
    position: absolute;
    top: 50%;
    left: 2vw;
    right: 2vw;
    transform: translateY(-50%);
    color: rgba(255, 255, 255, 0.5);
    pointer-events: none;
    font-size: 8vw;
    text-align: center;
    font-weight: 600;
    letter-spacing: 0.55vw;
  }

  .title-front {
    z-index: 20;
    -moz-text-stroke-color: rgba(255, 255, 255, 0.5);
    -webkit-text-stroke-color: rgba(255, 255, 255, 0.5);
    -moz-text-stroke-width: 0.085vw;
    -webkit-text-stroke-width: 0.085vw;
    -moz-text-fill-color: transparent;
    -webkit-text-fill-color: transparent;
  }

  .title-back {
    z-index: 1;
  }

  footer {
    position: relative;
    z-index: 20;
    width: 100%;
    margin-top: auto;
    padding: 1.5rem;
  }

  ul {
    margin: 0;
    padding: 0;
    text-align: right;

    li {
      list-style: none;
      a {
        opacity: 0.5;
        color: #ffffff;
        text-decoration: none;
        border-bottom: 1px solid white;
      }
    }
  }
}
</style>
