import Engine from '@hanged-man/engine';
import { Injectable } from '@nestjs/common';

import { ForbiddenActionError } from '../../common/errors/forbidden-action.error';
import { PlayerRepository } from '../player/player.repository';
import { RoomGateway } from '../room/room.gateway';
import { RoomRepository } from '../room/room.repository';
import { GameDto } from './dtos/game.dto';
import { GameNotFoundError } from './errors/game-not-found.error';
import { GameRepository } from './game.repository';

@Injectable()
export class GameService {
  private readonly games: Record<string, Engine | null> = {};

  public constructor(
    private readonly roomRepository: RoomRepository,
    private readonly gameRepository: GameRepository,
    private readonly playerRepository: PlayerRepository,
    private readonly roomGateway: RoomGateway,
  ) {}

  public async create(roomId: string, userId: string, trials?: number): Promise<GameDto> {
    const room = await this.roomRepository.findOneOrFail(roomId);
    const player = await this.playerRepository.findOneOrFail({ where: { userId } });

    if (player.id !== room.owner) {
      throw new ForbiddenActionError();
    }

    if (room.players.length < 2) {
      throw new ForbiddenActionError();
    }

    const getPlayersOperations = room.players.map((id) => this.playerRepository.findOneOrFail(id));
    const players = await Promise.all(getPlayersOperations);
    const ids = players.map((p) => p.id);

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

    const updatedPlayers = players.map((p) => ({ ...p, isInGame: true }));
    const updatePlayersOperations = updatedPlayers.map((p) => this.playerRepository.update(p.id, p));
    await Promise.all(updatePlayersOperations);

    const { winner, isFinished, partialWord } = await this.gameRepository.findOneOrFail(id);

    this.roomGateway.gameStarted(roomId, id);

    return {
      id, winner, isFinished, trials: game.trials, partialWord,
    };
  }

  public async play(gameId: string, input: string, userId: string): Promise<GameDto> {
    const player = await this.playerRepository.findOneOrFail({ where: { userId } });
    const game = await this.gameRepository.findOneOrFail(gameId);
    const room = await this.roomRepository.findOneOrFail({ where: { gameId } });
    const currentGame = this.games[game.id];

    if (currentGame == null) {
      throw new GameNotFoundError();
    }

    if (game.isFinished) {
      throw new ForbiddenActionError();
    }

    if (!room.players.includes(player.id)) {
      throw new ForbiddenActionError();
    }

    if (currentGame.getCurrentPlayer() !== player.id) {
      throw new ForbiddenActionError();
    }

    const partialWord = currentGame.checkInput(input);
    const isFinished = currentGame.gameState() !== 0;
    const winner = (currentGame.gameState() === 1)
      ? currentGame.getCurrentPlayer()
      : null;

    if (currentGame.gameState() === 0) {
      currentGame.nextPlayer();
    }

    if (isFinished) {
      delete this.games[game.id];

      if (winner != null) {
        const winnerEntity = await this.playerRepository.findOneOrFail(winner);
        await this.playerRepository.update(winner, { gamesWon: winnerEntity.gamesWon + 1 });
      }

      const freePlayersOperations = room.players.map((playerId) => this.playerRepository.update(playerId, { isInGame: false, isInRoom: false }));
      await Promise.all(freePlayersOperations);
    }

    await this.gameRepository.update(gameId, { isFinished, partialWord, winner });

    const result: GameDto = {
      id: game.id,
      trials: game.trials,
      isFinished,
      partialWord,
      winner,
    };

    return result;
  }
}
