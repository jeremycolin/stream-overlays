import dotenv from "dotenv";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5000,
  },
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
      "@": path.resolve(__dirname, "/src"),
      "~@": path.resolve(__dirname, "/src"),
      experiences: path.resolve(__dirname, "/src/experiences"),
    },
  },
});
