import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { IUserTokenResponseDto, RefreshUserTokenDto } from './dto/refresh-user.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
  ) {}

  @Post('login')
  async login(@Body() body: LoginUserDto):Promise<IUserTokenResponseDto> {
    const user = await this.authService.validateUser(body.name, body.password);
    if (!user) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
    const tokens = await this.authService.login(user);
    return tokens;
  }

  @Post('refresh')
  async refresh(@Body() body: RefreshUserTokenDto):Promise<IUserTokenResponseDto> {
    const tokens = await this.authService.refreshToken(body.refreshToken);
    if (!tokens) {
      throw new HttpException('Invalid refresh token', HttpStatus.UNAUTHORIZED);
    }
    return tokens;
  }
}