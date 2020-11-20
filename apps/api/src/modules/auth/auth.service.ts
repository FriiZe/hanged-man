import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { pbkdf2Sync } from 'crypto';

import { ConfigService } from '../core/services/config.service';
import { UserRepository } from '../user/user.repository';
import { TokenDto } from './dtos/token.dto';
import { BadCredentialsError } from './errors/bad-credentials.error';
import { UsernameAlreadyTakenError } from './errors/username-already-taken.error';

@Injectable()
export class AuthService {
  public constructor(
    private readonly userRepository: UserRepository,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  public async login(username: string, password: string): Promise<TokenDto> {
    const user = await this.userRepository.findOneOrFail({ where: { username } });

    const hashedPassword = pbkdf2Sync(password, this.configService.salt, 100000, 64, 'sha512').toString('base64');
    if (user.password !== hashedPassword) {
      throw new BadCredentialsError();
    }

    const { password: pass, ...passwordlessUser } = user;
    const token = this.jwtService.sign(passwordlessUser);

    return { token };
  }

  public async register(username: string, password: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { username } });
    if (user !== undefined) {
      throw new UsernameAlreadyTakenError();
    }

    const hashedPassword = pbkdf2Sync(password, this.configService.salt, 100000, 64, 'sha512').toString('base64');
    await this.userRepository.insert({ username, password: hashedPassword });
  }
}
