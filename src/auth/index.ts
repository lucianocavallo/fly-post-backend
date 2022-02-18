import type { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { config } from '../config';

const orm = new PrismaClient();

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await orm.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    res.status(401).json({ message: "There's no user with that email" });
  }

  const isMatch = await compare(password, user?.password as string);

  if (!isMatch) {
    res.status(401).json({ message: 'unauthorized' });
  } else {
    const token = sign({ sub: user?.id }, config.jwtSecret);
    res.status(200).json({ token, id: user?.id, username: user?.username });
  }
};
