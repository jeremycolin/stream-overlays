import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import App from "./App.vue";
import startScene from "./scenes/start.vue";
import liveScene from "./scenes/live.vue";
import endScene from "./scenes/end.vue";

const routes = [
  { path: "/:user/", component: startScene },
  { path: "/:user/start", component: startScene },
  { path: "/:user/live", component: liveScene },
  { path: "/:user/end", component: endScene },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

const app = createApp(App);
app.config.unwrapInjectedRef = true;

app.use(router);

app.mount("#app");
