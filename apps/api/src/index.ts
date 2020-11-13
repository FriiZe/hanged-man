import { createConnection } from 'typeorm';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { json, urlencoded } from 'body-parser';
import {
  dbHost, dbPass, dbPort, dbUser, port,
} from './config';
import Game from './entities/Game';
import History from './entities/History';
import Player from './entities/Player';
import Room from './entities/Room';
import User from './entities/User';
import routes from './routes';
import { handleError, handleNotFound } from './middlewares/errorHandling';

const main = async () => {
  await createConnection({
    type: 'postgres',
    host: dbHost,
    port: dbPort,
    password: dbPass,
    username: dbUser,
    entities: [
      Game,
      History,
      Player,
      Room,
      User,
    ],
    synchronize: true,
  });

  const app = express();

  app
    .use(helmet())
    .use(cors())
    .use(urlencoded({ extended: true }))
    .use(json());

  app
    .use(routes);

  app
    .use('*', handleNotFound)
    .use(handleError);

  app.listen(port, () => { console.log(`Listening on port ${port}`); });
};

void main();
