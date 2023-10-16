<template>
  <router-view />
</template>

<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Noto+Sans+Runic&family=Skranji&display=swap");

@font-face {
  font-family: "cartograph_cfbold_italic";
  src: url("/fonts/cartographcf-bolditalic-webfont.woff2") format("woff2"),
    url("/fonts/cartographcf-bolditalic-webfont.woff") format("woff");
  font-weight: normal;
  font-style: normal;
}

html,
body,
#app {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}

* {
  &,
  &::before,
  &::after {
    box-sizing: border-box;
  }
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.generic-background {
  background-image: radial-gradient(farthest-corner circle at 100% 0%, #00dfff 0%, #8c00ea 100%);
}
</style>
