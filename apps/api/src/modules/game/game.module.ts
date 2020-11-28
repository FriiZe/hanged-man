import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CoreModule } from '../core/core.module';
import { PlayerRepository } from '../player/player.repository';
import { RoomRepository } from '../room/room.repository';
import { GameController } from './game.controller';
import { GameGateway } from './game.gateway';
import { GameRepository } from './game.repository';
import { GameService } from './game.service';

@Module({
  imports: [
    CoreModule,
    TypeOrmModule.forFeature([GameRepository]),
    TypeOrmModule.forFeature([RoomRepository]),
    TypeOrmModule.forFeature([PlayerRepository]),
  ],
  providers: [
    GameService,
    GameGateway,
  ],
  controllers: [
    GameController,
  ],
})
export class GameModule {}
