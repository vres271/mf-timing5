import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { User } from './users/entities/user.entity';
import { AuthModule } from './auth/auth.module';
import { InitService } from './init/init.service';
import { RacesModule } from './races/races.module';
import { Race } from './races/entities/race.entity';


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: 5432,
      username: process.env.DB_USER || 'youruser',
      password: process.env.DB_PASSWORD || 'yourpassword',
      database: process.env.DB_NAME || 'yourdb',
      entities: [User, Race],
      synchronize: true, 
    }),
    UsersModule,
    AuthModule,
    RacesModule,
  ],
  controllers: [AppController],
  providers: [AppService, InitService],
})
export class AppModule {}
