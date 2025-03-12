import { IsString } from 'class-validator';

export enum UserTokenKeys {
  ACCESS_TOKEN = 'access_token',
  REFRESH_TOKEN = 'refresh_token',
}

export class RefreshUserTokenDto {
  @IsString()
  readonly refreshToken: string;
}

export class IUserTokenResponseDto {
  access_token: string;
  refresh_token: string;
}