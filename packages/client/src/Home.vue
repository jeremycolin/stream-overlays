<script>
import AppTitle from "@/components/title.vue";

export default {
  name: "app-home",
  components: {
    AppTitle,
  },
};
</script>

<template>
  <div class="home generic-background">
    <app-title></app-title>
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

  footer {
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
