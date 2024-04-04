const get = require('../common/getProperty');
const utility = require('./utility');
const handleLogProperties = require('../common/handleLogProperties');

const loggerHandler = ({
  message,
  processId,
  start,
  statusCode,
  event,
  responseObject,
  error,
  sourceIp,
  path,
  body,
  queryStringParameters,
  headers,
  httpMethod,
  application,
  environment,
}) => {
  try {
    const bodyLog = body || get('body', event);

    const headersNormalized = utility.normalizeProperties(headers || get('headers', event));

    const logObject = {
      processId,
      application,
      environment,
      message,
      date: new Date(),
      duration: new Date - start,
      statusCode,
      path: path || get('path', event),
      body: bodyLog ? JSON.parse(bodyLog) : null,
      queryStringParameters: queryStringParameters || get('queryStringParameters', event),
      userAgent: get('user-agent', headersNormalized),
      consumerKey: get('consumer-key', headersNormalized),
      headers: headersNormalized,
      consumerIp: sourceIp || get('requestContext.identity.sourceIp', event),
      method: httpMethod || get('httpMethod', event),
      errorMessage: get('message', error),
      errorStack: get('stack', error),
      resLength: responseObject ? Buffer.byteLength(JSON.stringify(responseObject)) : '0',
      resBody: JSON.stringify(responseObject)
    }

    handleLogProperties(logObject);

    return logObject;
  } catch (error) {
    console.log(error);
    return {};
  }
}

module.exports = loggerHandler;