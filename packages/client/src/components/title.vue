<script>
export default {
  name: "AppTitle",
};
</script>

<template>
  <h1 class="app-title">
    <span class="visually-hidden">Stream Overlay</span>
    <svg aria-hidden="true" id="lockup-title-mask" class="app-title lockup-title-mask visually-hidden">
      <clipPath id="lockup-title-mask-path">
        <text dominant-baseline="hanging" text-anchor="middle" x="50%" y="0em" dy="0.125em">Stream Overlay</text>
      </clipPath>
    </svg>
  </h1>
</template>

<style lang="scss">
h1.app-title {
  position: absolute;
  color: white;
  width: 280px;
  height: 50px;
  top: 0;
  left: 0;
}

@supports (backdrop-filter: blur(12px)) {
  .visually-hidden {
    position: absolute;
    top: -9999px;
    left: -9999px;
  }
  h1.app-title {
    backdrop-filter: blur(12px);
    background: rgba(white, 0.2);
    clip-path: url(#lockup-title-mask-path);
  }
}
</style>
