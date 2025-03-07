import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { ITokenPayload } from '../models/tokens.interface';

@Injectable({
  providedIn: 'root',
})
export class JwtService {
  decodeToken(token: string) {
    try {
      return jwtDecode<ITokenPayload>(token);
    } catch (error) {
      console.error('Error decoding JWT token:', error);
      return null;
    }
  }
}