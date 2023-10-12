import { dbPool } from "./index";

if (!process.env.SYM_ENCRYPTION_KEY) {
  throw Error("ENV variable SYM_ENCRYPTION_KEY missing");
}

const pgp_sym_encrypt = process.env.SYM_ENCRYPTION_KEY;

export class oAuthTokensPersistentStorage {
  static async hasTokens(userId: string): Promise<boolean | undefined> {
    try {
      const { rows } = await dbPool.query(`SELECT EXISTS(SELECT 1 FROM user_tokens WHERE ID = $1);`, [userId]);
      return rows[0].exists;
    } catch (err) {
      console.error(err);
    }
  }

  static async getTokens(userId: string): Promise<{ access_token: string; refresh_token: string } | undefined> {
    try {
      const { rows } = await dbPool.query(
        `
        SELECT PGP_SYM_DECRYPT(access_token, $2) as access_token, PGP_SYM_DECRYPT(refresh_token, $2) as refresh_token FROM user_tokens WHERE id = $1;
        `,
        [userId, pgp_sym_encrypt]
      );
      return rows[0];
    } catch (err) {
      console.error(err);
    }
  }

  static async setTokens(userId: string, { access_token, refresh_token }: { access_token: string; refresh_token: string }) {
    try {
      await dbPool.query(
        `
        INSERT INTO user_tokens (id, access_token, refresh_token) VALUES ($1, PGP_SYM_ENCRYPT($2, $4), PGP_SYM_ENCRYPT($3, $4))
        ON CONFLICT (id) DO UPDATE SET access_token = PGP_SYM_ENCRYPT($2, $4), refresh_token = PGP_SYM_ENCRYPT($3, $4);
        `,
        [userId, access_token, refresh_token, pgp_sym_encrypt]
      );
    } catch (err) {
      console.error(err);
    }
  }
}
