import { resolve } from "path";

export const isDev = process.env.NODE_ENV !== "production";

export const config = {
  SERVER_PORT: isDev ? 3000 : process.env.PORT,
  ASSETS_PATH: resolve(__dirname, "..", "..", "client", "dist"),
};
