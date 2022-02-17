import type { PrismaClient } from '@prisma/client';

type ResolverContext = {
  orm: PrismaClient;
};

export const resolvers = {
  Query: {
    users: async (parent: unknown, args: unknown, context: ResolverContext) => {
      const { orm } = context;
      return await orm.user.findMany();
    },
    posts: async (parent: unknown, args: unknown, context: ResolverContext) => {
      const { orm } = context;
      return await orm.post.findMany();
    },
  },
};
