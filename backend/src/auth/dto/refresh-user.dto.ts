import { IsString } from 'class-validator';

export class RefreshUserTokenDto {
  @IsString()
  readonly refreshToken: string;
}

export class IUserTokenResponseDto {
  access_token: string;
  refresh_token: string;
}