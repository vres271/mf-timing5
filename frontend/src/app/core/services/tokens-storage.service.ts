import { Injectable } from '@angular/core';
import { ITokens } from '../models/tokens.interface';

enum TokenKey {
  AccessToken = 'accessToken',
  RefreshToken = 'refreshToken',
}

@Injectable()
export class TokensStorageService {

  private readonly storage = window.localStorage;

  constructor() { }

  private setToken(tokenKey: TokenKey, token: string | null): void {
    if (token === null) {
      this.removeToken(tokenKey);
    } else {
      this.storage.setItem(tokenKey, token);
    }
  }

  setAccessToken(accessToken: string | null): void {
    this.setToken(TokenKey.AccessToken, accessToken);
  }

  setRefreshToken(refreshToken: string | null): void {
    this.setToken(TokenKey.RefreshToken, refreshToken);
  }

  setTokens(tokens: ITokens): void {
    this.setAccessToken(tokens.accessToken);
    this.setRefreshToken(tokens.refreshToken);
  }

  getAccessToken(): string | null {
    return this.storage.getItem(TokenKey.AccessToken);
  }

  getRefreshToken(): string | null {
    return this.storage.getItem(TokenKey.RefreshToken);
  }

  getTokens(): ITokens {
    return {
      accessToken: this.getAccessToken(),
      refreshToken: this.getRefreshToken(),
    };
  }

  removeAccessToken(): void {
    this.storage.removeItem(TokenKey.AccessToken);
  }

  removeRefreshToken(): void {
    this.storage.removeItem(TokenKey.RefreshToken);
  }

  removeToken(tokenKey: TokenKey): void {
    this.storage.removeItem(tokenKey);
  }

  removeTokens(): void {
    this.removeAccessToken();
    this.removeRefreshToken();
  }

}
