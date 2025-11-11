import winston from "winston";

const transports = [];
transports.push(
  new winston.transports.Console({
    format: winston.format.printf((info) => {
      const logObject = {
        level: info.level,
        message: info.message,
        data: info.data || {},
        timestamp: new Date().toISOString(),
      };
      return JSON.stringify(logObject);
    }),
  })
);

const logger = winston.createLogger({
  levels: winston.config.npm.levels,
  format: winston.format.combine(
    winston.format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  transports,
});

export function addLog(level: string, message: string, data?: unknown) {
  logger.log({
    timestamp: new Date().toISOString(),
    level,
    message,
    data,
  });
}
