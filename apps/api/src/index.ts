import { createConnection } from 'typeorm';
import express from 'express';
import {
  dbHost, dbPass, dbPort, dbUser, port,
} from './config';
import Game from './entities/Game';
import History from './entities/History';
import Player from './entities/Player';
import Room from './entities/Room';
import User from './entities/User';

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

  app.listen(port, () => { console.log(`Listening at http://localhost:${port}`); });
};

void main();
