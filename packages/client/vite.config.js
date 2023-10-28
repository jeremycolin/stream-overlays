import { fileURLToPath } from "url";
import path from "path";
import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import glsl from "vite-plugin-glsl";

const dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vitejs.dev/config/
export default defineConfig((mode) => {
  const envDir = path.resolve(dirname, "../../");
  const env = loadEnv(mode, envDir, "");

  return {
    plugins: [vue(), glsl()],
    server: {
      port: 5000,
    },
    envDir,
    define: {
      IS_DEV: env.NODE_ENV !== "production",
      APP_CLIENT_ID: JSON.stringify(env.TWITCH_CLIENT_ID),
      TWITCH_OAUTH_REDIRECT_URL: JSON.stringify(env.TWITCH_OAUTH_REDIRECT_URL),
      __WEBSOCKET_ENDPOINT__: JSON.stringify(
        env.NODE_ENV === "production" ? "wss://stream-overlays-production.up.railway.app/" : "ws://localhost:3000/"
      ),
      __SERVER_ENDPOINT__: JSON.stringify(
        env.NODE_ENV === "production" ? "https://stream-overlays-production.up.railway.app" : "http://localhost:3000"
      ),
    },
    resolve: {
      alias: {
        "@": path.resolve(dirname, "/src"),
        "~@": path.resolve(dirname, "/src"),
      },
    },
  };
});
