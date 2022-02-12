export const isDev = process.env.NODE_ENV !== "production";

export const config = {
  SERVER_PORT: isDev ? 8080 : 443,
  SOCKET_SERVER_PORT: 3000,
};
