export class oAuthTokensMemoryStorage {
  private static oAuthTokenMemoryStage = new Map<string, { access_token: string; refresh_token: string }>(); // <userId, token>

  static hasTokens(userId: string) {
    return this.oAuthTokenMemoryStage.has(userId);
  }

  static getTokens(userId: string) {
    return this.oAuthTokenMemoryStage.get(userId)!;
  }

  static setTokens(userId: string, { access_token, refresh_token }: { access_token: string; refresh_token: string }) {
    this.oAuthTokenMemoryStage.set(userId, { access_token, refresh_token });
  }
}
