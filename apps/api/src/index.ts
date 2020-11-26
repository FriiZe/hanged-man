import { ExceptionFilter, PipeTransform, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import helmet from 'helmet';

import { AppModule } from './app.module';
import { CustomAdapter } from './common/custom.adapter';
import { BadCodeFilter } from './filters/bad-code.filter';
import { BadCredentialsFilter } from './filters/bad-credentials.filter';
import { DisplayNameAlreadyTakenFilter } from './filters/display-name-already-taken.filter';
import { EntityNotFoundFilter } from './filters/entity-not-found.filter';
import { ForbiddenActionFilter } from './filters/forbidden-action.filter';
import { UniqueDisplayNameUserFilter } from './filters/unique-display-name-user.filter';
import { UsernameAlreadyTakenFilter } from './filters/username-already-taken.filter';
import { ConfigService } from './modules/core/services/config.service';

const main = async (): Promise<void> => {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const { port } = configService;

  const pipes: PipeTransform[] = [
    new ValidationPipe(),
  ];

  const filters: ExceptionFilter[] = [
    new EntityNotFoundFilter(),
    new BadCredentialsFilter(),
    new UsernameAlreadyTakenFilter(),
    new DisplayNameAlreadyTakenFilter(),
    new UniqueDisplayNameUserFilter(),
    new ForbiddenActionFilter(),
    new BadCodeFilter(),
  ];

  app.enableCors();
  app.use(helmet());

  app.useGlobalPipes(...pipes);
  app.useGlobalFilters(...filters);

  app.useWebSocketAdapter(new CustomAdapter(configService, app));

  await app.listen(port);
};

void main();
