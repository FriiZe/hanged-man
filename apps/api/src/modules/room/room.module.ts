import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PlayerRepository } from '../player/player.repository';
import { RoomController } from './room.controller';
import { RoomGateway } from './room.gateway';
import { RoomRepository } from './room.repository';
import { RoomService } from './room.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([RoomRepository]),
    TypeOrmModule.forFeature([PlayerRepository]),
  ],
  providers: [
    RoomService,
    RoomGateway,
  ],
  controllers: [RoomController],
})
export class RoomModule {}
