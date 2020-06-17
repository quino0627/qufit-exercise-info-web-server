/* eslint-disable import/no-extraneous-dependencies */
import { ErrorRequestHandler } from 'express';
import { logDefinedError, logUndefinedError } from './logger';

type ErrorType = {
  statusCode: number;
  errorCode: number;
  msg: string;
};

const exceptions: { [key: string]: ErrorType } = {
  INTERNAL_SERVER_ERROR: {
    statusCode: 500,
    errorCode: 0,
    msg: 'Internal Server Error',
  },
};
/*
 * 오류 처리
 */
export const handleError: ErrorRequestHandler = (err, req, res, next) => {
  const errorName = err.message in exceptions ? err.message : 'INTERNAL_SERVER_ERROR';
  const { statusCode, errorCode, msg } = exceptions[errorName];
  console.log('hello');
  if (errorName === 'INTERNAL_SERVER_ERROR') {
    logUndefinedError(req, res, err);
  } else {
    logDefinedError(req, res, errorName);
  }

  res.status(statusCode).json({
    errorCode,
    msg: msg + (err.message in exceptions ? '' : ` - ${err.message}`),
  });
};

export default handleError;
