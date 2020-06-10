import './env';
import server from './server';
import logger from './lib/logger';

const { PORT } = process.env;
const port = PORT || 4000;
