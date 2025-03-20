export interface ITokens {
  accessToken: string | null;
  refreshToken: string | null;
}

export interface ITokensDTO {
  access_token: string ;
  refresh_token: string;
}

export interface ITokenPayload {
  sub: string;
  roles: string[];
  username: string;
}

