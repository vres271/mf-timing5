import { Injectable, Logger } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { UserRole } from 'src/users/entities/user.entity';

@Injectable()
export class InitService {
  private readonly logger = new Logger(InitService.name);

  constructor(private readonly usersService: UsersService) { }

  async createFirstAdmin(): Promise<void> {
    const admin = await this.usersService
      .findAll()
      .then((users) => users.find((u) => u.name === 'sa'));

    if (!admin) {
      const createAdminDto = {
        name: 'sa',
        email: 'sa@mft5.com',
        password: '000000',
      };

      const newUser = await this.usersService.create(createAdminDto);
      if (newUser?.id) {
        this.logger.log(`Superadmin created: ${newUser.name}@${createAdminDto.password}`);
        await this.usersService.addRole(newUser.id, UserRole.ADMIN);
      } else {
        this.logger.error(`Superadmin create error`);
      }
    } else {
      this.logger.log('Superadmin already exists, skipping seed');
    }
  }
}
