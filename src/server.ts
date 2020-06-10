import { GraphQLServer } from 'graphql-yoga';
import { PrismaClient } from '@prisma/client';
import schema from './schema';
import { logApiRequest } from './lib/logger';

const prisma = new PrismaClient();

const server = new GraphQLServer({
  schema,
  context: ({ request }) => ({
    request,
    prisma,
  }),
});

server.express.use(logApiRequest);

export default server();
