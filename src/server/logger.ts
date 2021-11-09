import winston from 'winston';

const defaultLogLevel = 'info';

const logger = winston.createLogger({
  level: defaultLogLevel,
  transports: [],
});

logger.add(
  new winston.transports.Console({
    format: winston.format.simple(),
  }),
);

export default logger;
