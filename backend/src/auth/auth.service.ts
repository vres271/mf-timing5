import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../users/user.service';
import * as bcrypt from 'bcrypt';
import { UserRole } from 'src/users/entities/user.entity';
import { ITokenPayload } from './interfaces/token-payload.interface'; 
import { IUser } from 'src/users/interfaces/user.interface';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(name: string, pass: string): Promise<IUser|null> {
    const user = await this.userService.findOneWithPassword(name);
    if (user && await bcrypt.compare(pass, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: IUser) {
    const payload: ITokenPayload = {
      username: user.name,
      sub: user.id,
      roles: user.roles
    };
    const tokens = {
      access_token: this.jwtService.sign(payload),
      refresh_token: this.jwtService.sign(payload, { expiresIn: '7d' }),
    };
    await this.userService.updateRefreshToken(user.id, tokens.refresh_token);
    return tokens;
  }

  async refreshToken(refreshToken: string):Promise<{access_token: string, refresh_token: string}|null> {
    const user = await this.userService.findOneByRefreshToken(refreshToken);
    if (user) {
      const payload: ITokenPayload = {
        username: user.name,
        sub: user.id,
        roles: user.roles
      };
      const tokens = {
        access_token: this.jwtService.sign(payload),
        refresh_token: this.jwtService.sign(payload, { expiresIn: '7d' }),
      };
      await this.userService.updateRefreshToken(user.id, tokens.refresh_token);
      return tokens;
    }
    return null;
  }
}