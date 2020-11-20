import { Module } from '@nestjs/common';

import { AuthModule } from './modules/auth/auth.module';
import { CoreModule } from './modules/core/core.module';
import { PlayerModule } from './modules/player/player.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    CoreModule,
    UserModule,
    AuthModule,
    PlayerModule,
  ],
})
export class AppModule {}
