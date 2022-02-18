import { ApolloServer } from 'apollo-server-express';
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import http from 'http';
import { join } from 'path';
import { readFileSync } from 'fs';
import { PrismaClient } from '@prisma/client';

import { app } from './server';
import { resolvers } from './resolvers';
const typeDefs = readFileSync(join(__dirname, 'schema.graphql'), 'utf-8');

const orm = new PrismaClient();

(async function () {
  const httpServer = http.createServer(app);

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    context: ({ req }) => {
      const { user } = req;
      return {
        orm,
        user,
      };
    },
  });

  await server.start();

  server.applyMiddleware({ app, path: '/graphql' });

  await new Promise<void>((resolve) =>
    httpServer.listen({ port: 4000 }, resolve)
  );
  console.log(`🚀 Server ready at http://localhost:4000`);
})();
