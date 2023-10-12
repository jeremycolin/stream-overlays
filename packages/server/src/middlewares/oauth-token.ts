import { NextFunction, Request, Response } from "express";
import { getUserOauthTokens, validateUserOauthToken } from "../apis/oauth-twitch";
import { oAuthTokensPersistentStorage } from "../database/tokens";

export async function oAuthTokenMiddleWare(req: Request, res: Response, next: NextFunction) {
  console.log("Received oAuth code from client, now validating the code with the Twitch API");

  try {
    const { code } = JSON.parse(req.body);

    const tokens = await getUserOauthTokens({ code });
    if (!tokens) {
      console.error("Unable to get user oauth tokens from Twitch API using oauth client code");
      return;
    }
    console.log("Sucessfully got Twitch access and refresh tokens for the user");

    const tokenData = await validateUserOauthToken({ access_token: tokens.access_token });
    if (!tokenData) {
      console.error("Unable to validate user oauth token with Twitch API");
      return;
    }

    console.log(`Saving token for user_id ${tokenData.user_id} in db`);
    await oAuthTokensPersistentStorage.setTokens(tokenData.user_id, tokens);
  } catch (err) {
    console.error(err);
  }
  res.end();
}
