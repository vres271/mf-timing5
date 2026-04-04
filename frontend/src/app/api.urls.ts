const base = '/api';

export enum ApiUrl {
  // AUTH (core)
  AuthMe = base + '/auth/me',
  AuthLogin = base + '/auth/login',
  AuthRefresh = base + '/auth/refresh',
  AuthLogout = base + '/auth/logout',

  // Util
  Health = base + '/health',

  // DOMAINS (features)
  Races = base + '/races',
  Users = base + '/users',

}