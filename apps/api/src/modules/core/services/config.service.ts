import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { get } from 'env-var';

import { GameEntity } from '../../game/game.entity';
import { PlayerEntity } from '../../player/player.entity';
import { RoomEntity } from '../../room/room.entity';
import { UserEntity } from '../../user/user.entity';

@Injectable()
export class ConfigService {
  public get port(): number {
    return get('PORT')
      .required()
      .asPortNumber();
  }

  public get wsPort(): number {
    return get('WS_PORT')
      .required()
      .asPortNumber();
  }

  public get databaseConfiguration(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: get('DB_HOST').required().asString(),
      port: get('DB_PORT').required().asPortNumber(),
      username: get('DB_USER').required().asString(),
      password: get('DB_PASS').required().asString(),
      entities: [
        UserEntity,
        PlayerEntity,
        RoomEntity,
        GameEntity,
      ],
    };
  }

  public get salt(): string {
    return get('SALT').required().asString();
  }

  public get jwtSecret(): string {
    return get('JWT_SECRET').required().asString();
  }

  public get environment(): 'DEVELOPMENT' | 'PRODUCTION' {
    return get('ENVIRONMENT')
      .required()
      .asEnum(['DEVELOPMENT', 'PRODUCTION']);
  }
}
