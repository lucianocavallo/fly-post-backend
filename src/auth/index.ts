import type { Request, Response, RequestHandler, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { compare } from 'bcrypt';
import { sign, verify } from 'jsonwebtoken';
import { config } from '../config';

declare global {
  namespace Express {
    interface User {
      id: string;
    }
    interface Request {
      user?: Express.User;
    }
  }
}

const orm = new PrismaClient();

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;
  try {
    const user = await orm.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) throw new Error('unauthorized');

    const isMatch = await compare(password, user?.password as string);

    if (!isMatch) throw new Error('unauthorized');

    const token = sign({ sub: user?.id }, config.jwtSecret);
    res.status(200).json({ token, id: user?.id, username: user?.username });
  } catch (error) {
    next(error);
  }
};

export const verifyToken = async (req: Request) => {
  const { authorization } = req.headers;
  const token = (authorization || '').replace('Bearer ', '');

  try {
    const verified = verify(token, config.jwtSecret);
    return verified;
  } catch (error) {
    throw new Error('unauthorized');
  }
};

const authMiddleware: RequestHandler = async (req, res, next) => {
  try {
    const payload = await verifyToken(req);
    req.user = { id: payload.sub as string };
  } catch (error) {
    // next(error);
  } finally {
    next();
  }
};

export default authMiddleware;
