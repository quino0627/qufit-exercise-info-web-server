import './env';
import { Options } from 'graphql-yoga';
import server from './server';
import logger from './lib/logger';

const PORT = process.env.PORT || 4000;
const PLAYGROUND_ENDPOINT = '/playground';
const GRAPHQL_ENDPOINT = '/graphql';

const serverOptions: Options = {
  port: PORT,
  playground: PLAYGROUND_ENDPOINT,
  endpoint: GRAPHQL_ENDPOINT,
};

const handleServerStart = () => logger.debug(`listening to port ${PORT}`);

server.start(serverOptions, handleServerStart);
