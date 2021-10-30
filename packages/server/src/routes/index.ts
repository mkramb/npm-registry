import express from 'express';

import { getPackage } from './getPackage';

function routes(router: express.Router): express.Router {
  return router.get('/package/:name/:version', getPackage);
}

export { routes };
