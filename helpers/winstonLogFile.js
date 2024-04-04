const winston = require('winston');
const utility = require("../helpers/utility");
const DailyRotateFile = require('winston-daily-rotate-file');

const getApplicationWithEnvironment = (application, environment) => {
  return utility.stringFormatter("%@-%@", application, environment);
};

const logFile = (data) => {

  const loggerWinston = winston.createLogger({});
  loggerWinston.add(new DailyRotateFile({
    filename: utility.stringFormatter("%@/%@/requests-log", "/var/log", getApplicationWithEnvironment(data.application, data.environment)),
    maxSize: '100m'
  }));
  loggerWinston.info('', data);
  loggerWinston.close();
};

const logFilePath = (data) => {

  const loggerWinston = winston.createLogger({});
  loggerWinston.add(new DailyRotateFile({
    filename: utility.stringFormatter("%@/%@.log", process.env.LOG_PATH, getApplicationWithEnvironment(data.application, data.environment)),
    maxSize: '100m',

  }));
  loggerWinston.info('', data);
  loggerWinston.close();
};

module.exports = { logFile, logFilePath };
