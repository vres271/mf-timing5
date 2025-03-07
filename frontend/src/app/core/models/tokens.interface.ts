export interface ITokens {
  accessToken: string | null;
  refreshToken: string | null;
}

export interface ITokenPayload {
  sub: string;
  roles: string[];
  username: string;
}