/* eslint-disable import/no-extraneous-dependencies */
import { Request, Response, NextFunction } from 'express';
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
export const logApiRequest = (req: Request, res: Response, next: NextFunction): void => {
  const { method } = req;
  logger.info(`${method}`);
  next();
};

/**
 * 정의된 에러 발생시 로깅
 * WARNING Timestamp : Method Path : UID={user_id} : ErrorCode : AllParameters
 */
export const logDefinedError = (req: Request, res: Response, errorMessage: string): void => {
  const parameter = {
    ...req.params,
    ...req.body,
    ...req.query,
  };

  // Password 평문 로깅 방지
  if ('password' in parameter) parameter.password = '비밀번호는 너굴맨이 처리햇다';

  const { method, path } = req;
  const userID = res.locals.user ? res.locals.user.user_id : undefined;

  logger.warning(
    `${method} ${path} : UID=${userID} : ${errorMessage} : ${JSON.stringify(parameter)}`,
  );
};

/**
 * 정의되지 않은 에러 발생시 로깅
 * CRIT Timestamp : Method Path : UID={user_id} : ErrorMessage : AllParameters
 */
export const logUndefinedError = (req: Request, res: Response, error: Error): void => {
  const parameter = {
    ...req.params,
    ...req.body,
    ...req.query,
  };

  // Password 평문 로깅 방지
  if ('password' in parameter) parameter.password = '비밀번호는 너굴맨이 처리햇다';

  const { method, path } = req;
  const userID = res.locals.user ? res.locals.user.user_id : undefined;

  logger.crit(`${method} ${path} : UID=${userID} : ${error} : ${JSON.stringify(parameter)}`);
};

export default logger;
