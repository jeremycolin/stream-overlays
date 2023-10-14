import { fileURLToPath } from "url";
import path from "path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import glsl from "vite-plugin-glsl";

const dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), glsl()],
  server: {
    port: 5000,
  },
  envDir: path.resolve(dirname, "../../"),
  define: {
    IS_DEV: process.env.NODE_ENV !== "production",
    APP_CLIENT_ID: JSON.stringify(process.env.TWITCH_CLIENT_ID),
    TWITCH_OAUTH_REDIRECT_URL: JSON.stringify(process.env.TWITCH_OAUTH_REDIRECT_URL),
    __WEBSOCKET_ENDPOINT__: JSON.stringify(
      process.env.NODE_ENV === "production" ? "wss://stream-overlays-production.up.railway.app/" : "ws://localhost:3000/"
    ),
    __SERVER_ENDPOINT__: JSON.stringify(
      process.env.NODE_ENV === "production" ? "https://stream-overlays-production.up.railway.app" : "http://localhost:3000"
    ),
  },
  resolve: {
    alias: {
      "@": path.resolve(dirname, "/src"),
      "~@": path.resolve(dirname, "/src"),
    },
  },
});
