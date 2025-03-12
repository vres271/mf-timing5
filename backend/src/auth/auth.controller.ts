import { Controller, Post, Body, HttpException, HttpStatus, Res, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { IUserTokenResponseDto, UserTokenKeys } from './dto/refresh-user.dto';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
  ) {}

  @Post('login')
  async login(@Body() body: LoginUserDto, @Res() res: Response<IUserTokenResponseDto>) {
    const user = await this.authService.validateUser(body.name, body.password);
    if (!user) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
    const tokens = await this.authService.login(user);
    this.setClientTokens(res, tokens);
    return res.send(tokens);
  }

  @Post('refresh')
  async refresh(@Req() req: Request, @Res() res: Response<IUserTokenResponseDto>) {
    const refreshToken = req?.cookies[UserTokenKeys.REFRESH_TOKEN];
    if (!refreshToken) {
      throw new HttpException('Refresh token not found', HttpStatus.UNAUTHORIZED);
    }
    const tokens = await this.authService.refreshToken(refreshToken);
    if (!tokens) {
      throw new HttpException('Invalid refresh token', HttpStatus.UNAUTHORIZED);
    }
    this.setClientTokens(res, tokens);
    return res.send(tokens);
  }

  private setClientTokens(res: Response, tokens: IUserTokenResponseDto) {
    res.cookie(UserTokenKeys.ACCESS_TOKEN, tokens.access_token, { httpOnly: true });
    res.cookie(UserTokenKeys.REFRESH_TOKEN, tokens.refresh_token, { httpOnly: true, path: '/api/auth' });
  }

}