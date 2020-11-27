import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PlayerRepository } from '../player/player.repository';
import { RoomRepository } from '../room/room.repository';
import { GameController } from './game.controller';
import { GameRepository } from './game.repository';
import { GameService } from './game.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([GameRepository]),
    TypeOrmModule.forFeature([RoomRepository]),
    TypeOrmModule.forFeature([PlayerRepository]),
  ],
  providers: [
    GameService,
  ],
  controllers: [
    GameController,
  ],
})
export class GameModule {}
