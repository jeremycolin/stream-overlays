export const isDev = process.env.NODE_ENV !== "production";

export const config = {
  SERVER_PORT: isDev ? 8080 : process.env.PORT,
  SOCKET_SERVER_PORT: 3000,
};
