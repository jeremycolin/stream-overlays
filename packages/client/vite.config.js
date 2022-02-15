import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5000,
  },
  define: {
    isDev: process.env.NODE_ENV !== "production",
    __WEBSOCKET_ENDPOINT__: JSON.stringify(
      process.env.NODE_ENV === "production" ? "wss://streamoverlays.herokuapp.com/" : "ws://localhost:3000/"
    ),
  },
});
