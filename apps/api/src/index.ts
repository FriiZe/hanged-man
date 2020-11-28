import { ExceptionFilter, PipeTransform, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';

import { AppModule } from './app.module';
import { CustomAdapter } from './common/custom.adapter';
import { BadCodeFilter } from './filters/http/bad-code.filter';
import { BadCredentialsFilter } from './filters/http/bad-credentials.filter';
import { DisplayNameAlreadyTakenFilter } from './filters/http/display-name-already-taken.filter';
import { HttpEntityNotFoundFilter } from './filters/http/http-entity-not-found.filter';
import { HttpForbiddenActionFilter } from './filters/http/http-forbidden-action.filter';
import { UniqueDisplayNameUserFilter } from './filters/http/unique-display-name-user.filter';
import { UsernameAlreadyTakenFilter } from './filters/http/username-already-taken.filter';
import { ConfigService } from './modules/core/services/config.service';

const main = async (): Promise<void> => {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const { port } = configService;

  const pipes: PipeTransform[] = [
    new ValidationPipe(),
  ];

  const filters: ExceptionFilter[] = [
    new HttpEntityNotFoundFilter(),
    new BadCredentialsFilter(),
    new UsernameAlreadyTakenFilter(),
    new DisplayNameAlreadyTakenFilter(),
    new UniqueDisplayNameUserFilter(),
    new HttpForbiddenActionFilter(),
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
