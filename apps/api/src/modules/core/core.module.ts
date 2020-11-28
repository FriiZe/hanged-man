/* eslint-disable @typescript-eslint/no-use-before-define */
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ConfigService } from './services/config.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [CoreModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({ secret: configService.jwtSecret }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [CoreModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        ...configService.databaseConfiguration,
        synchronize: true,
      }),
    }),
  ],
  providers: [
    ConfigService,
  ],
  exports: [
    ConfigService,
    JwtModule,
  ],
})
export class CoreModule {}
