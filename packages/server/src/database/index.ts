import { Pool } from "pg";

export const dbPool = new Pool();

export async function setupDatabase() {
  await dbPool.query(`CREATE EXTENSION IF NOT EXISTS pgcrypto;`);

  await dbPool.query(`
    CREATE TABLE IF NOT EXISTS user_tokens (
    id SERIAL NOT NULL PRIMARY KEY,
    access_token BYTEA NOT NULL,
    refresh_token BYTEA NOT NULL);
  `);

  console.log("Database setup complete");
}
