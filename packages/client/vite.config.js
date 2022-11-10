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
    isDev: process.env.NODE_ENV !== "production",
    __WEBSOCKET_ENDPOINT__: JSON.stringify(
      process.env.NODE_ENV === "production" ? "wss://stream-overlays-production.up.railway.app/" : "ws://localhost:3000/"
    ),
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "/src"),
      "~@": path.resolve(__dirname, "/src"),
    },
  },
});
