export const isDev = process.env.NODE_ENV !== "production";

export const config = {
  SERVER_PORT: isDev ? 3000 : process.env.PORT,
};
