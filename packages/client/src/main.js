import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import App from "./App.vue";
import waitingScreen from "./components/waitingScreen.vue";
import broadcastOverlay from "./components/overlay.vue";

const routes = [
  { path: "/:user/", component: waitingScreen },
  { path: "/:user/overlay", component: broadcastOverlay },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

const app = createApp(App);
app.config.unwrapInjectedRef = true;

app.use(router);

app.mount("#app");
