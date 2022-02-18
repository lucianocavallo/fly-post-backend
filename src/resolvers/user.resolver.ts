import type { PrismaClient, User } from '@prisma/client';
import { hash } from 'bcrypt';

type ResolverContext = {
  orm: PrismaClient;
};

export async function create(
  parent: unknown,
  { input }: { input: User },
  { orm }: ResolverContext
) {
  const { username, email, password } = input;
  const hashedPasswd = await hash(password, 10);

  return await orm.user.create({
    data: {
      username,
      email,
      password: hashedPasswd,
    },
  });
}

export async function findAll(
  parent: unknown,
  args: unknown,
  { orm }: ResolverContext
) {
  return await orm.user.findMany({
    include: {
      posts: true,
    },
  });
}

export async function findOne(
  parent: unknown,
  { id, email }: { id: string; email: string },
  { orm }: ResolverContext
) {
  if (id) {
    return await orm.user.findUnique({
      where: { id: parseInt(id) },
      include: {
        posts: true,
      },
    });
  }
  if (email) {
    return await orm.user.findUnique({
      where: { email: email },
      include: {
        posts: true,
      },
    });
  }
  return null;
}

export async function update(
  parent: unknown,
  { id, input }: { id: string; input: User },
  { orm }: ResolverContext
) {
  return await orm.user.update({
    where: { id: parseInt(id) },
    data: {
      ...input,
    },
  });
}

export async function remove(
  parent: unknown,
  { id }: { id: string },
  { orm }: ResolverContext
) {
  return await orm.user.delete({
    where: { id: parseInt(id) },
  });
}
