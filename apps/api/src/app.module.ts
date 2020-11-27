import { Module } from '@nestjs/common';

import { AuthModule } from './modules/auth/auth.module';
import { CoreModule } from './modules/core/core.module';
import { GameModule } from './modules/game/game.module';
import { PlayerModule } from './modules/player/player.module';
import { RoomModule } from './modules/room/room.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    CoreModule,
    UserModule,
    AuthModule,
    PlayerModule,
    RoomModule,
    GameModule,
  ],
})
export class AppModule {}
