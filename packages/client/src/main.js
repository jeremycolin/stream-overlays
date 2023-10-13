import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import App from "./App.vue";
import AuthCallback from "./AuthCallback.vue";
import Overlay from "./Overlay.vue";
import Home from "./Home.vue";

const routes = [
  { path: "/:user/:scene", component: Overlay, name: "scene" },
  { path: "/oauth", component: AuthCallback, name: "oauth" },
  { path: "/", component: Home, name: "home" },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

const app = createApp(App);

app.config.unwrapInjectedRef = true;
app.use(router);
app.mount("#app");
