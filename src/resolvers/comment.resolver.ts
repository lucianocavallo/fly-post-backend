import type { PrismaClient } from '@prisma/client';

type ResolverContext = {
  orm: PrismaClient;
};

export async function create(
  parent: unknown,
  { input }: { input: { postId: string; userId: string; comment: string } },
  { orm }: ResolverContext
) {
  return await orm.comment.create({
    data: {
      userId: parseInt(input.userId),
      postId: parseInt(input.postId),
      comment: input.comment,
    },
  });
}

export async function remove(
  parent: unknown,
  { id }: { id: string },
  { orm }: ResolverContext
) {
  return await orm.comment.delete({
    where: { id: parseInt(id) },
  });
}
