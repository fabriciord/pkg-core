'use strict';

const Logger = require('../logger')
const uuid = require('uuid/v1');
const { MongoError } = require('mongodb');

const Errors = require('../customError');
const Utility = require('../utility.js')

const getStatusCodeError = error => {
  if (error.isBoom) {
    return error.output.payload.statusCode;
  }

  return error.statusCode || error.status_code || (error.response && error.response.status) || 500;
};

const genericErrorLambda = (params, loggerConfig) => {
  const { event, start, config, error } = params;

  const statusCode = getStatusCodeError(error);

  const log = {
    statusCode,
    application: config.logger.name,
    environment: config.environment,
    error,
    event,
    headers: event.headers,
    processId: uuid(),
    start,
  };

  Logger.sendEs(log, loggerConfig, loggerConfig.logData);

  if (Errors.IsCustomError(error)) {
    return {
      statusCode,
      body: JSON.stringify(error.toResponseData()),
    }
  }

  const response = {
    statusCode,
    body: JSON.stringify({
      message: error.message,
      stack: error.stack,
    }),
  }

  if (error instanceof MongoError) {
    response.body.message = error.name
  }

  return response;
};

const genericErrorDocker = (params, loggerConfig) => {
  const { execptionKeys = [] } = params;

  const { payload, request, error, requestStart } = params;

  const statusCode = getStatusCodeError(error);

  const date = new Date(request.headers['x-req-start'] || requestStart);

  const { headers, path: requestPath, method, info } = request;

  const path = requestPath || request.routerPath;
  const consumerIp = (info && info.remoteAddress) || request.hostname;

  const errorMessages = {
    GENERIC_ERROR: error.message || 'Fail hard',
  };

  let responseObject = error;

  if (error instanceof Error) {
    responseObject = {
      message: error.message,
      stack: error.stack,
    }
  }

  Utility.encodeForbiddenCharacters(headers);
  const headersNormalized = Utility.normalizeProperties(headers);

  const log = {
    processId: uuid(),
    message: errorMessages.GENERIC_ERROR,
    start: date,
    statusCode,
    path,
    responseObject,
    headers: headersNormalized,
    consumerIp,
    httpMethod: method,
    error,
  };

  Logger.sendFileV2({
    execptionKeys,
    body: payload,
    ...log,
  }, loggerConfig, loggerConfig.logData);

  Logger.error({
    application: process.env.SERVICE_NAME,
    environment: process.env.NODE_ENV,
    body: JSON.stringify(payload),
    ...log,
  });

  if (Errors.IsCustomError(error)) {
    return error.toResponseData();
  }

  return {
    statusCode,
    result: error,
  };
};

const genericError = params => {
  const loggerConfig = {
    application: process.env.SERVICE_NAME,
    environment: process.env.NODE_ENV,
    logData: Object.is(process.env.LOG_DATA, 'true'),
  };

  if (params.event) {
    return genericErrorLambda(params, loggerConfig);
  }

  return genericErrorDocker(params, loggerConfig);
};

module.exports = { genericError };
