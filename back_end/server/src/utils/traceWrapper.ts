import logger from './logger';

export function traceMethod<T extends (...args: any[]) => Promise<any>>(
  functionName: string,
  fn: T
) {
  return async function (...args: Parameters<T>): Promise<ReturnType<T>> {
    const startTime = Date.now();
    logger.info(`Function started`, { functionName, inputParams: args });

    try {
      const result = await fn(...args);
      const duration = Date.now() - startTime;
      logger.info(`Function completed`, { functionName, duration: `${duration}ms` });
      return result;
    } catch (error: any) {
      logger.error(`Function failed`, {
        functionName,
        error: error.message || error,
        stack: error.stack,
      });
      throw error;
    }
  };
}
