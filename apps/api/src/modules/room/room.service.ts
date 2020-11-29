import { Injectable } from '@nestjs/common';

import { ForbiddenActionError } from '../../common/errors/forbidden-action.error';
import { PlayerDto } from '../player/dtos/player.dto';
import { PlayerEntity } from '../player/player.entity';
import { PlayerRepository } from '../player/player.repository';
import { CreateRoomDto } from './dtos/create-room.dto';
import { JoinRoomDto } from './dtos/join-room.dto';
import { LeaveRoomDto } from './dtos/leave-room.dto';
import { RoomDto } from './dtos/room.dto';
import { BadCodeError } from './errors/bad-code.error';
import { RoomGateway } from './room.gateway';
import { RoomRepository } from './room.repository';

@Injectable()
export class RoomService {
  public constructor(
    private readonly roomRepository: RoomRepository,
    private readonly playerRepository: PlayerRepository,
    private readonly roomGateway: RoomGateway,
  ) {}

  public async list(): Promise<RoomDto[]> {
    const result = await this.roomRepository.find();

    return result.map(({ code, ...rest }) => ({ ...rest }));
  }

  public async get(id: string): Promise<RoomDto> {
    const { code, ...rest } = await this.roomRepository.findOneOrFail(id);

    return rest;
  }

  public async create(params: CreateRoomDto, userId: string): Promise<RoomDto> {
    const player = await this.playerRepository.findOneOrFail({ where: { userId } });

    await this.playerInRoomGuard(player);

    const room = {
      name: params.name,
      code: params.code,
      isPublic: params.code === undefined,
      players: [player.id],
      owner: player.id,
    };

    const { identifiers } = await this.roomRepository.insert(room);
    const [identifier] = identifiers;
    const roomId = identifier.id;

    await this.playerRepository.update(player.id, { ...player, isInRoom: true });

    const { code, ...rest } = await this.roomRepository.findOneOrFail(roomId);
    this.roomGateway.roomCreated(roomId);

    return { ...rest };
  }

  public async join(params: JoinRoomDto): Promise<void> {
    const { roomId, userId } = params;

    const { players, code, ...rest } = await this.roomRepository.findOneOrFail(roomId);

    if (code != null) {
      if (params.code !== code) {
        throw new BadCodeError();
      }
    }

    const player = await this.playerRepository.findOneOrFail({ where: { userId } });

    await this.playerInRoomGuard(player);

    const updatedRoom = { ...rest, players: [...players, player.id] };
    await this.roomRepository.update(updatedRoom.id, updatedRoom);

    await this.playerRepository.update(player.id, { ...player, isInRoom: true });

    this.roomGateway.playerJoined(roomId, player.id);
  }

  public async leave(params: LeaveRoomDto): Promise<void> {
    const { roomId } = params;
    const player = await this.playerRepository.findOneOrFail({ where: { userId: params.userId } });

    if (!player.isInRoom) {
      throw new ForbiddenActionError();
    }

    const { players, ...rest } = await this.roomRepository.findOneOrFail(roomId);
    const filteredPlayers = players.filter((id) => id !== player.id);

    await this.roomRepository.update(roomId, { ...rest, players: filteredPlayers });
    await this.playerRepository.update(player.id, { ...player, isInRoom: false });

    const room = await this.roomRepository.findOneOrFail(roomId);
    if (room.players.length === 0 || player.id === room.owner) {
      await this.roomRepository.delete(roomId);
      this.roomGateway.roomDeleted(roomId);
    } else {
      this.roomGateway.playerLeft(roomId, player.id);
    }
  }

  public async players(roomId: string): Promise<PlayerDto[]> {
    const room = await this.roomRepository.findOneOrFail(roomId);
    const operations = room.players.map((player) => this.playerRepository.findOneOrFail(player));
    const players = await Promise.all(operations);
    const result = players.map(({ userId, ...rest }) => ({ ...rest }));

    return result;
  }

  private async playerInRoomGuard(player: PlayerEntity): Promise<void> {
    if (player.isInRoom || player.isInGame) {
      throw new ForbiddenActionError();
    }
  }
}
