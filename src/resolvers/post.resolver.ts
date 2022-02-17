import type { Post, PrismaClient } from '@prisma/client';

type ResolverContext = {
  orm: PrismaClient;
};

export async function create(
  parent: unknown,
  { input }: { input: { body: string; userId: string } },
  { orm }: ResolverContext
) {
  return await orm.post.create({
    data: {
      body: input.body,
      userId: parseInt(input.userId),
    },
  });
}

export async function findAll(
  parent: unknown,
  { userId }: { userId: string },
  { orm }: ResolverContext
) {
  if (userId) {
    return await orm.post.findMany({
      where: { userId: parseInt(userId) },
      include: {
        user: true,
        comments: {
          include: {
            user: true,
          },
        },
        usersLikes: true,
      },
    });
  }

  return await orm.post.findMany({
    include: {
      user: true,
      comments: {
        include: {
          user: true,
        },
      },
      usersLikes: true,
    },
  });
}

export async function findOne(
  parent: unknown,
  { id }: { id: string },
  { orm }: ResolverContext
) {
  return await orm.post.findUnique({
    where: { id: parseInt(id) },
    include: {
      user: true,
      comments: {
        include: {
          user: true,
        },
      },
      usersLikes: true,
    },
  });
}

export async function update(
  parent: unknown,
  { id, input }: { id: string; input: Post },
  { orm }: ResolverContext
) {
  return await orm.post.update({
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
  return await orm.post.delete({
    where: { id: parseInt(id) },
  });
}