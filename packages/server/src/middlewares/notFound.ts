import express from 'express';
import { StatusCodes } from 'http-status-codes';

export function notFound(_req: express.Request, res: express.Response): void {
  res.status(StatusCodes.NOT_FOUND);
  res.send();
}
