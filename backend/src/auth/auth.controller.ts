import { Controller, Post, Body, HttpException, HttpStatus, Res, Req, Get, Headers } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { IUserTokenResponseDto, UserTokenKeys } from './dto/refresh-user.dto';
import { Request, Response } from 'express';
import { UserService } from 'src/users/user.service';
import { JwtService } from '@nestjs/jwt';
import { IUser } from 'src/users/interfaces/user.interface';
import { IMeDto } from './dto/me.dto';
import { IUserTokenPayloadDto } from './dto/token-payload.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  @Get('me')
  async getProfile(
    @Headers('X-User') userId: string,
    @Req() req,
    @Res() res: Response<IMeDto>,
  ) {
    const token: string = req.cookies['access_token'];
    if (!token) {
      throw new HttpException('Auth token not found', HttpStatus.UNAUTHORIZED);
    }
    const decodedToken = this.jwtService.decode<IUserTokenPayloadDto>(token);
    const user = await this.userService.findOneById(userId);
    if (!user) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
    res.header('X-Token-Expires-In', decodedToken.exp);
    return res.send(user);
  }

  @Post('login')
  async login(@Body() body: LoginUserDto, @Res() res: Response<IMeDto>) {
    const user = await this.authService.validateUser(body.name, body.password);
    if (!user) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
    const tokens = await this.authService.login(user);
    this.setClientTokens(res, tokens);
    return res.send(user);
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
    return res.send();
  }

  @Post('logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    // Получаем refresh token из куки
    const refreshToken = req?.cookies[UserTokenKeys.REFRESH_TOKEN];
    if (!refreshToken) {
      throw new HttpException('Refresh token is missing', HttpStatus.BAD_REQUEST);
    }

    // Инвалидируем refresh token на бэкенде
    const invalidated = await this.authService.invalidateRefreshToken(refreshToken);
    if (!invalidated) {
      throw new HttpException('Invalidation error', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    // Возвращаем успешный ответ
    return res.status(200).json({ message: 'Logged out successfully' });
  }

  private setClientTokens(res: Response, tokens: IUserTokenResponseDto) {
    res.header('X-Token-Expires-In', this.authService.authTokenExpiresIn);
    res.cookie(UserTokenKeys.ACCESS_TOKEN, tokens.access_token, { httpOnly: true });
    res.cookie(UserTokenKeys.REFRESH_TOKEN, tokens.refresh_token, { httpOnly: true, path: '/api/auth' });
  }

}