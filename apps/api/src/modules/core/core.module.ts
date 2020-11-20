/* eslint-disable @typescript-eslint/no-use-before-define */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ConfigService } from './services/config.service';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [CoreModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        ...configService.databaseConfiguration,
        synchronize: true,
      }),
    }),
  ],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class CoreModule {}
