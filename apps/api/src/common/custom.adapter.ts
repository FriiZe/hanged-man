/* eslint-disable no-param-reassign */
import { INestApplicationContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { IncomingMessage } from 'http';
// eslint-disable-next-line import/no-extraneous-dependencies
import { ServerOptions } from 'socket.io';

import { ConfigService } from '../modules/core/services/config.service';

type AllowFunction = (err: string | null | undefined, success: boolean) => void;

export class CustomAdapter extends IoAdapter {
  private readonly jwtService: JwtService;

  public constructor(
    private readonly configService: ConfigService,
    app: INestApplicationContext,
  ) {
    super(app);

    this.jwtService = app.get(JwtService);
  }

  public createIOServer(_port: number, options: ServerOptions): unknown {
    const port = this.configService.wsPort;

    options.allowRequest = this.allowRequest.bind(this);

    return super.createIOServer(port, options);
  }

  private async allowRequest(request: IncomingMessage, allowFunction: AllowFunction): Promise<void> {
    const header = request.headers.authorization ?? '';
    const token = header.slice(7);

    try {
      await this.jwtService.verifyAsync(token, { ignoreExpiration: true });
      return allowFunction(null, true);
    } catch {
      return allowFunction('Unauthorized', false);
    }
  }
}
