import type { PrismaClient, User } from '@prisma/client';

type ResolverContext = {
  orm: PrismaClient;
};

export const resolvers = {
  Query: {
    users: async (parent: unknown, args: unknown, { orm }: ResolverContext) => {
      return await orm.user.findMany({
        include: {
          posts: true,
        },
      });
    },
    posts: async (parent: unknown, args: unknown, { orm }: ResolverContext) => {
      return await orm.post.findMany({
        include: {
          user: true,
        },
      });
    },
  },
  Mutation: {
    createUser: async (
      parent: unknown,
      { input }: { input: User },
      { orm }: ResolverContext
    ) => {
      return await orm.user.create({ data: input });
    },
    createPost: async (
      parent: unknown,
      { input }: { input: { body: string; userId: string } },
      { orm }: ResolverContext
    ) => {
      return await orm.post.create({
        data: {
          body: input.body,
          userId: parseInt(input.userId),
        },
      });
    },
  },
};
