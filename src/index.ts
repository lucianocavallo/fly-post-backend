import { ApolloServer } from 'apollo-server-express';
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import express from 'express';
import http from 'http';
import { join } from 'path';
import { readFileSync } from 'fs';

const typeDefs = readFileSync(join(__dirname, 'schema.graphql'), 'utf-8');

const users = [
  {
    id: 1,
    email: 'luciano@mail.com',
    username: 'luciano',
  },
];

const resolvers = {
  Query: {
    users: () => {
      return users;
    },
  },
};

(async function () {
  const app = express();
  const httpServer = http.createServer(app);
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });
  await server.start();
  server.applyMiddleware({ app, path: '/graphql' });
  await new Promise<void>((resolve) =>
    httpServer.listen({ port: 4000 }, resolve)
  );
  console.log(`🚀 Server ready at http://localhost:4000`);
})();
