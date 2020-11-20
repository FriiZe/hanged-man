import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { get } from 'env-var';

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
      ],
    };
  }

  public get salt(): string {
    return get('SALT').required().asString();
  }

  public get jwtSecret(): string {
    return get('JWT_SECRET').required().asString();
  }
}
