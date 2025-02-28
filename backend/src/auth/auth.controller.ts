import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from '../users/user.service';
import { LoginUserDto } from './dto/login-user.dto';
import { RefreshUserTokenDto } from './dto/refresh-user.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @Post('login')
  async login(@Body() body: LoginUserDto) {
    const user = await this.authService.validateUser(body.name, body.password);
    if (!user) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
    const tokens = await this.authService.login(user);
    await this.userService.updateRefreshToken(user.id, tokens.refresh_token);
    return tokens;
  }

  @Post('refresh')
  async refresh(@Body() body: RefreshUserTokenDto) {
    const tokens = await this.authService.refreshToken(body.refreshToken);
    if (!tokens) {
      throw new HttpException('Invalid refresh token', HttpStatus.UNAUTHORIZED);
    }
    return tokens;
  }
}