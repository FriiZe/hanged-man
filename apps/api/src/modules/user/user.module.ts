import { Module } from '@nestjs/common';

import { UserRepository } from './user.repository';

@Module({
  imports: [UserRepository],
  exports: [UserRepository],
})
export class UserModule {}
