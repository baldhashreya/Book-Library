import winston from "winston";

export const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.printf((info) => {
      const logObject = {
        level: info.level,
        message: info.message,
        data: info.data || {},
        timestamp: new Date().toISOString(),
      };
      return JSON.stringify(logObject);
    })
  ),
  transports: [
    new winston.transports.Console(), // logs to console
    // new winston.transports.File({ filename: "app.log" }), // logs to file
  ],
});
