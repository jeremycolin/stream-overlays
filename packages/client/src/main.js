import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import App from "./App.vue";
import sceneManager from "./scenes/manager.vue";

const routes = [{ path: "/:user/:scene", component: sceneManager }];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

const app = createApp(App);
app.config.unwrapInjectedRef = true;

app.use(router);

app.mount("#app");
