import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Socket } from 'socket.io';

@Injectable()
export class AuthWsGuard implements CanActivate {
  public constructor(
    private readonly jwtService: JwtService,
  ) {}

  public canActivate(context: ExecutionContext): boolean {
    const wsContext = context.switchToWs();
    const client = wsContext.getClient<Socket>();
    const data = wsContext.getData();

    const token = client.handshake.headers.authorization as string;
    const jwt = token.slice(7);

    const result = this.jwtService.decode(jwt) as Record<string, unknown> | null;
    data.userId = result?.id;

    return result != null && result?.id != null;
  }
}
