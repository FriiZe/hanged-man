import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserRepository } from '../user/user.repository';
import { PlayerController } from './player.controller';
import { PlayerRepository } from './player.repository';
import { PlayerService } from './player.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([PlayerRepository]),
    TypeOrmModule.forFeature([UserRepository]),
  ],
  providers: [PlayerService],
  controllers: [PlayerController],
})
export class PlayerModule {}
