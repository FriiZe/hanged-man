import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { ConfigService } from '../core/services/config.service';
import { JwtDto } from './dtos/jwt.dto';

@Injectable()
class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.jwtSecret,
    });
  }

  validate(payload: JwtDto & {iat: number}): JwtDto {
    const { iat, ...result } = payload;

    return result;
  }
}

export default JwtStrategy;
