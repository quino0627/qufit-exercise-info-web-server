import { GraphQLServer } from 'graphql-yoga';
import { createLogger, format, transports, config } from 'winston';
import 'winston-daily-rotate-file';

const { combine, timestamp, printf } = format;
const { NODE_ENV } = process.env;

const LOG_DIR = `${__dirname}/../../log`;

// eslint-disable-next-line no-shadow
const loggerFormat = printf(({ level, message, timestamp }) => {
  return `${level.toUpperCase()} ${timestamp} : ${message}`;
});

const transport = [];

// * 개발환경은 콘솔, 프로덕션에서는 파일에 로깅한다.
if (NODE_ENV === 'production') {
  const dailyRotateFileTransport = new transports.DailyRotateFile({
    filename: `${LOG_DIR}/%DATE%.log`,
    datePattern: 'YYYY-MM-DD',
    handleExceptions: true,
    level: 'debug',
    maxFiles: '7d',
  });
  const errorFileTransport = new transports.DailyRotateFile({
    filename: `${LOG_DIR}/error_%DATE%.log`,
    datePattern: 'YYYY-MM-DD',
    handleExceptions: true,
    level: 'error',
    maxFiles: '14d',
  });
  transport.push(dailyRotateFileTransport, errorFileTransport);
} else {
  const showInConsole = new transports.Console({
    handleExceptions: true,
    level: 'debug',
    format: format.colorize({
      all: true,
    }),
  });
  transport.push(showInConsole);
}

export const logger = createLogger({
  levels: config.syslog.levels,
  format: combine(timestamp(), loggerFormat),
  transports: transport,
  exitOnError: false,
});

/**
 * API 요청시 로깅
 * INFO Timestamp : Method Path : UID={user_id}
 */
export const logApiRequest = (req: Request, res: Response): void => {
  console.log('In LogAPIREQ', req, res);
  const { method } = req;
  //   logger.info(`${method} ${path} : UID=${userID}`);
};
