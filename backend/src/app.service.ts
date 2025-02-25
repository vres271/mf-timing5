import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
  getHealth(): string {
    return `Backend is ok! On ${(
      process?.env?.COMPUTERNAME ?
      process?.env?.COMPUTERNAME + ':' + process?.env?.OS :
      process?.env?.PATH
    )} `;
  }
}
