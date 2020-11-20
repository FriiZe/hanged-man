import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CoreModule } from '../core/core.module';
import { ConfigService } from '../core/services/config.service';
import { UserRepository } from '../user/user.repository';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import JwtStrategy from './auth.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserRepository]),
    ConfigService,
    JwtModule.registerAsync({
      imports: [CoreModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({ secret: configService.jwtSecret }),
    }),
  ],
  providers: [
    AuthService,
    ConfigService,
    JwtStrategy,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
