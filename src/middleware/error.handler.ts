import type { NextFunction, Request, Response } from 'express';

const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err.message === 'unauthorized')
    return res.status(401).send('unauthorized');
  console.error('Error handler: ', err);
  res.status(500).send('internal server error');
};

export default errorHandler;
