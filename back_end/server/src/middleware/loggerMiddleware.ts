import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import logger from '../utils/logger';

export interface ExtendedRequest extends Request {
  reqId?: string;
}

export const requestLogger = (req: ExtendedRequest, res: Response, next: NextFunction) => {
  const reqId = crypto.randomUUID();
  req.reqId = reqId;

  const startTime = Date.now();

  const safeBody = { ...req.body };
  if (safeBody.password) delete safeBody.password;

  logger.info(`[HTTP] Started ${req.method} ${req.url}`, {
    reqId,
    method: req.method,
    url: req.url,
    body: safeBody,
  });

  res.on('finish', () => {
    const duration = Date.now() - startTime;
    logger.info(`[HTTP] Completed ${req.method} ${req.url} [Status: ${res.statusCode}]`, {
      reqId,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
    });
  });

  next();
};
