import { getRepository } from 'typeorm';
import { EntityNotFoundError as TypeormEntityNotFoundError } from 'typeorm/error/EntityNotFoundError';
import CreatePlayerDto from '../dtos/CreatePlayerDto';
import IdDto from '../dtos/IdDto';
import PlayerDto from '../dtos/PlayerDto';
import UpdatePlayerDto from '../dtos/UpdatePlayerDto';
import Player from '../entities/Player';
import DisplayNameAlreadyTakenError from '../errors/DisplayNameAlreadyTakenError';
import EntityNotFoundError from '../errors/EntityNotFoundError';
import UniqueDisplayNameUserError from '../errors/UniqueDisplayNameUserError';

const writeGuard = async (displayName: string): Promise<void> => {
  const repository = getRepository(Player);
  const searchDisplayName = await repository.findOne({ where: { displayName } });

  if (searchDisplayName !== undefined) {
    throw new DisplayNameAlreadyTakenError();
  }
};

export const get = async (id: string): Promise<PlayerDto> => {
  let player: PlayerDto;

  try {
    const { userId, ...entity } = await getRepository(Player).findOneOrFail(id);
    player = entity;
  } catch (error: unknown) {
    if (error instanceof TypeormEntityNotFoundError) {
      throw new EntityNotFoundError();
    }

    throw error;
  }

  return player;
};

export const create = async (player: CreatePlayerDto): Promise<IdDto> => {
  const repository = getRepository(Player);
  const searchUserId = await repository.findOne({ where: { userId: player.userId } });

  await writeGuard(player.displayName);

  if (searchUserId !== undefined) {
    throw new UniqueDisplayNameUserError();
  }

  const result = await getRepository(Player).insert(player);
  const [identifier] = result.identifiers;

  return { id: identifier.id };
};

export const update = async (player: UpdatePlayerDto): Promise<void> => {
  const repository = getRepository(Player);

  await writeGuard(player.displayName);

  await repository.findOneOrFail({ where: { userId: player.userId } });
  await repository.update({ userId: player.userId }, player);
};

export const me = async (userId: string): Promise<PlayerDto> => {
  let player: PlayerDto;

  try {
    const { userId: uid, ...entity } = await getRepository(Player)
      .findOneOrFail({ where: { userId } });

    player = entity;
  } catch (error: unknown) {
    if (error instanceof TypeormEntityNotFoundError) {
      throw new EntityNotFoundError();
    }

    throw error;
  }

  return player;
};
