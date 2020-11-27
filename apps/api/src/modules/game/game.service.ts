import Engine from '@hanged-man/engine';
import { Injectable } from '@nestjs/common';

import { PlayerRepository } from '../player/player.repository';
import { RoomRepository } from '../room/room.repository';
import { GameDto } from './dtos/game.dto';
import { GameRepository } from './game.repository';

@Injectable()
export class GameService {
  private readonly games: Record<string, Engine> = {};

  public constructor(
    private readonly roomRepository: RoomRepository,
    private readonly gameRepository: GameRepository,
    private readonly playerRepository: PlayerRepository,
  ) {}

  public async create(roomId: string, trials?: number): Promise<GameDto> {
    const room = await this.roomRepository.findOneOrFail(roomId);

    const getPlayersOperations = room.players.map((id) => this.playerRepository.findOneOrFail(id));
    const players = await Promise.all(getPlayersOperations);
    const ids = players.map((player) => player.id);

    const game = new Engine(ids, trials);
    const toInsert = {
      finalWord: game.word,
      partialWord: game.partialWord,
      trials: game.trials,
    };

    const { identifiers } = await this.gameRepository.insert(toInsert);
    const [identifier] = identifiers;
    const { id } = identifier;

    await this.roomRepository.update(roomId, { ...room, gameId: id });

    this.games[id] = game;

    const updatedPlayers = players.map((player) => ({ ...player, isInGame: true }));
    const updatePlayersOperations = updatedPlayers.map((player) => this.playerRepository.update(player.id, player));
    await Promise.all(updatePlayersOperations);

    const { winner, isFinished, partialWord } = await this.gameRepository.findOneOrFail(id);

    return {
      id, winner, isFinished, trials: game.trials, partialWord,
    };
  }
}
