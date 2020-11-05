import express, { Request, Response } from 'express';
import { port } from './config';

const app = express();

app.get('/', (req: Request, res: Response) => {
  res.send({ message: 'Welcome to api!' });
});

app.get('*', (req: Request, res: Response) => {
  res.status(404).send({
    message: 'The requested route was not found',
  });
});

const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/`);
});

server.on('error', console.error);
