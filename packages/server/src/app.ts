import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import logger from 'express-pino-logger';
import { createTerminus } from '@godaddy/terminus';
import { v4 as uuidv4 } from 'uuid';
import express from 'express';

import { notFound } from './middlewares/notFound';
import { routes } from './routes';

async function onHealthCheck() {
  // We can add any custom check
  // throw on error
  Promise.resolve();
}

/**
 * Bootstrap the application framework
 */
export function createApp(): http.Server {
  const app = express();
  const router = express.Router();

  const server = http.createServer(
    app
      .use(express.json())
      .use(helmet())
      .use(cors())
      .use(
        logger({
          genReqId: () => uuidv4(),
        })
      )
      .use(routes(router))
      .use(notFound)
  );

  createTerminus(server, {
    healthChecks: {
      '/healthcheck': onHealthCheck,
    },
  });

  return server;
}
