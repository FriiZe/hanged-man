import { Injectable } from '@nestjs/common';

import { UserRepository } from '../user/user.repository';
import { CreatePlayerDto } from './dtos/create-player.dto';
import { PlayerDto } from './dtos/player.dto';
import { UpdatePlayerDto } from './dtos/update-player.dto';
import { DisplayNameAlreadyTakenError } from './errors/display-name-already-taken.error';
import { UniqueDisplayNameUserError } from './errors/unique-display-name-user.error';
import { PlayerRepository } from './player.repository';

@Injectable()
export class PlayerService {
  public constructor(
    private readonly playerRepository: PlayerRepository,
    private readonly userRepository: UserRepository,
  ) {}

  public async get(id: string): Promise<PlayerDto> {
    const { userId, ...entity } = await this.playerRepository.findOneOrFail(id);

    return entity;
  }

  public async create(player: CreatePlayerDto): Promise<PlayerDto> {
    await this.writeGuard(player.displayName, player.userId);

    const searchUserId = await this.playerRepository.findOne({ where: { userId: player.userId } });
    if (searchUserId !== undefined) {
      throw new UniqueDisplayNameUserError();
    }

    const result = await this.playerRepository.insert(player);
    const [identifier] = result.identifiers;

    return this.get(identifier.id);
  }

  public async update(player: UpdatePlayerDto): Promise<PlayerDto> {
    await this.writeGuard(player.displayName, player.userId);

    await this.playerRepository.findOneOrFail({ where: { userId: player.userId } });
    await this.playerRepository.update({ userId: player.userId }, player);

    const result = await this.playerRepository.findOneOrFail({ where: { userId: player.userId } });

    return result;
  }

  public async me(userId: string): Promise<PlayerDto> {
    const { userId: uid, ...entity } = await this.playerRepository.findOneOrFail({ where: { userId } });

    return entity;
  }

  private async writeGuard(displayName: string, userId: string): Promise<void> {
    await this.userRepository.findOneOrFail(userId);

    const searchDisplayName = await this.playerRepository.findOne({ where: { displayName } });

    if (searchDisplayName !== undefined) {
      throw new DisplayNameAlreadyTakenError();
    }
  }
}
