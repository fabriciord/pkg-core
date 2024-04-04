const loggerHandler = require('./loggerHandler');
const loggerHandlerElasticSearch = require('./loggerHandlerElasticSearch');
const winstonLogFile = require('./winstonLogFile');
const winstonLogConsole = require('./winstonLogConsole');

const error = (log) => winstonLogConsole.error(loggerHandler(log));

const warn = (log) => winstonLogConsole.warn(loggerHandler(log));

const info = (log) => winstonLogConsole.info(loggerHandler(log));

const verbose = (log) => winstonLogConsole.verbose(loggerHandler(log));

const debug = (log) => winstonLogConsole.debug(loggerHandler(log));

const silly = (log) => winstonLogConsole.silly(loggerHandler(log));

const sendEs = (log, config, hasLogResponseBody = false) => console.log(JSON.stringify(loggerHandlerElasticSearch(log, config, hasLogResponseBody)));

const sendFile = (log, config, hasLogResponseBody = false) => winstonLogFile.logFile(loggerHandlerElasticSearch(log, config, hasLogResponseBody));

const sendFileV2 = (log, config, hasLogResponseBody = false) => winstonLogFile.logFilePath(loggerHandlerElasticSearch(log, config, hasLogResponseBody));

module.exports = {
  error,
  warn,
  info,
  verbose,
  debug,
  silly,
  sendEs,
  sendFile,
  sendFileV2,
}
