import { Controller, Get, Headers } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('')
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  getHealth(
    @Headers('X-User') user: string,
    @Headers('X-Roles') roles: string
  ): string {
    return `${this.appService.getHealth()}, user: ${user}, roles: ${roles}`;
  }
}
