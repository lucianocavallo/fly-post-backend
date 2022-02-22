import * as userResolver from './user.resolver';
import * as postResolver from './post.resolver';
import * as commentResolver from './comment.resolver';

export const resolvers = {
  Query: {
    users: userResolver.findAll,
    user: userResolver.findOne,
    posts: postResolver.findAll,
    postsById: postResolver.findByUser,
    post: postResolver.findOne,
  },
  Mutation: {
    createUser: userResolver.create,
    removeUser: userResolver.remove,
    updateUser: userResolver.update,
    createPost: postResolver.create,
    updatePost: postResolver.update,
    togglePostLike: postResolver.togglePostLike,
    removePost: postResolver.remove,
    createComment: commentResolver.create,
    removeComment: commentResolver.remove,
  },
};
