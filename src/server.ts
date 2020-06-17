import { GraphQLServer } from 'graphql-yoga';
import { PrismaClient } from '@prisma/client';
import morgan from 'morgan';
import schema from './schema';
import { logApiRequest } from './lib/logger';
import { handleError } from './lib/errorHandler';

const prisma = new PrismaClient();

const server = new GraphQLServer({
  schema,
  context: ({ request }) => ({
    request,
    prisma,
  }),
});

// server.express.use(morgan('dev'));
server.express.use(logApiRequest);
server.express.use(handleError);

export default server;
