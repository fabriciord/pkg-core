'use strict';

const Logger = require('../logger')
const uuid = require('uuid/v1');

const Utility = require('../utility.js')

const genericSuccessLambda = (params, loggerConfig) => {
  const { event, context, config, data, start } = params;

  if (context != null) {
    context.newValue = 1;
  }

  const log = {
    statusCode: 200,
    responseObject: data,
    application: config.logger.name,
    environment: config.environment,
    event,
    headers: event.headers,
    message: data.message ? data.message : '',
    processId: uuid(),
    start,
  };

  Logger.sendEs(log, loggerConfig, loggerConfig.logData);

  return {
    statusCode: 200,
    body: JSON.stringify(data),
    headers: event.headers
  };
};

const genericSuccessDocker = (params, loggerConfig) => {
  const { execptionKeys = [] } = params;

  const { custom, payload, request, response, requestStart } = params;

  const date = new Date(request.headers['x-req-start'] || requestStart);
  const { server, info, headers, path: requestPath, method } = request;

  const path = requestPath || request.routerPath;
  const consumerIp = (info && info.remoteAddress) || request.hostname;
  const serverIp = (server && server.info && server.info.address) || request.ip;
  const statusCode = response.statusCode ? response.statusCode : 200;

  Utility.encodeForbiddenCharacters(headers);

  const headersNormalized = Utility.normalizeProperties(headers);

  const log = {
    processId: uuid(),
    message: 'Success',
    start: date,
    statusCode,
    path,
    responseObject: response,
    custom,
    headers: headersNormalized,
    execptionKeys,
    serverIp,
    consumerIp,
    httpMethod: method,
  };

  Logger.sendFileV2({
    body: payload,
    ...log,
  }, loggerConfig, loggerConfig.logData);

  Logger.info({
    body: JSON.stringify(payload),
    ...log,
  });

  return response;
};

const genericSuccess = params => {
  const loggerConfig = {
    application: process.env.SERVICE_NAME,
    environment: process.env.NODE_ENV,
    logData: Object.is(process.env.LOG_DATA, 'true'),
  };

  if (params.event) {
    return genericSuccessLambda(params, loggerConfig);
  }

  return genericSuccessDocker(params, loggerConfig);
}

module.exports = { genericSuccess };
