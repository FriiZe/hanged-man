import { Injectable } from '@nestjs/common';
import { AuthGuard as NestAuthGuard } from '@nestjs/passport';

@Injectable()
class AuthGuard extends NestAuthGuard('jwt') {}

export default AuthGuard;
