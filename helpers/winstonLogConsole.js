const winston = require('winston');

const winstonLogger = winston.createLogger({
  format: winston.format.json(),
  transports: [new winston.transports.Console()]
});

module.exports = winstonLogger;

