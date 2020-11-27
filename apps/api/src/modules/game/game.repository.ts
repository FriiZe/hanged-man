import { EntityRepository, Repository } from 'typeorm';

import { GameEntity } from './game.entity';

@EntityRepository(GameEntity)
export class GameRepository extends Repository<GameEntity> {}
