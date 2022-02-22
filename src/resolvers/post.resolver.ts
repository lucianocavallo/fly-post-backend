import type { Post, PrismaClient, User } from '@prisma/client';

type ResolverContext = {
  orm: PrismaClient;
  user: User;
};

export async function create(
  parent: unknown,
  { body }: { body: string },
  { orm, user }: ResolverContext
) {
  console.log('user id', user.id);

  return await orm.post.create({
    data: {
      body: body,
      userId: user.id,
    },
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

export async function findAll(
  parent: unknown,
  { limit, offset }: { userId: string; limit: string; offset: string },
  { orm }: ResolverContext
) {
  if (limit && offset) {
    return await orm.post.findMany({
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit),
      skip: parseInt(offset),
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

  const posts = await orm.post.findMany({
    orderBy: { createdAt: 'desc' },
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
  return posts;
}

export async function findByUser(
  parent: unknown,
  { userId }: { userId: string },
  { orm }: ResolverContext
) {
  return await orm.post.findMany({
    orderBy: { createdAt: 'desc' },
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

export async function findOne(
  parent: unknown,
  { id }: { id: string },
  { orm }: ResolverContext
) {
  const post = await orm.post.findUnique({
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
  console.log('post: ', post);
  return post;
}

export async function togglePostLike(
  parent: unknown,
  { postId, userId }: { postId: string; userId: string },
  { orm }: ResolverContext
) {
  const postIdInt = parseInt(postId);
  const userIdInt = parseInt(userId);

  const post = await orm.post.findUnique({
    where: {
      id: postIdInt,
    },
    include: {
      user: true,
      usersLikes: true,
    },
  });

  if (post?.usersLikes.some((user) => user.id === userIdInt)) {
    return await orm.post.update({
      where: { id: postIdInt },
      data: {
        usersLikes: { disconnect: { id: userIdInt } },
      },
      include: {
        usersLikes: true,
        user: true,
      },
    });
  } else {
    return await orm.post.update({
      where: { id: postIdInt },
      data: {
        usersLikes: { connect: { id: userIdInt } },
      },
      include: {
        usersLikes: true,
        user: true,
      },
    });
  }
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
  await orm.comment.deleteMany({
    where: {
      postId: parseInt(id),
    },
  });
  return await orm.post.delete({
    where: { id: parseInt(id) },
  });
}
