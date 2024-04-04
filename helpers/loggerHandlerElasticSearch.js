const get = require('../common/getProperty');
const handleLogProperties = require('../common/handleLogProperties');
const utility = require('./utility');

const util = require('util');

const loggerHandler = ({
  custom,
  message,
  processId,
  start,
  statusCode,
  event,
  responseObject,
  error,
  consumerIp,
  serverIp,
  path,
  body,
  queryStringParameters,
  headers,
  execptionKeys,
  httpMethod,
}, config, hasLogResponseBody) => {
  try {
    const bodyLog = body || get('body', event);

    let responseObjectLog = null;

    if (hasLogResponseBody) {
      responseObjectLog = (typeof responseObject == "object") ? responseObject : { data: responseObject };
    }

    const environment = config.environment || 'dev';
    const elasticSearchIndex = config.application + '-' + config.environment;

    const headersNormalized = utility.normalizeProperties(headers || get('headers', event), execptionKeys);

    const logObject = {
      sendToElasticSearchLogs: true,
      sendToSplunk: true,
      elasticSearchIndex: elasticSearchIndex,
      processId,
      application: config.application,
      environment: environment,
      message,
      date: new Date(),
      duration: new Date - start,
      statusCode,
      custom,
      path: path || get('path', event),
      body: (typeof bodyLog == "object") ? bodyLog : { data: bodyLog },
      query: queryStringParameters || get('queryStringParameters', event),
      userAgent: get('user-agent', headersNormalized),
      consumerKey: get('consumer-key', headersNormalized),
      headers: headersNormalized,
      consumerIp: consumerIp || get('requestContext.identity.sourceIp', event),
      serverIp,
      method: httpMethod || get('httpMethod', event),
      errorMessage: get('message', error),
      errorStack: get('stack', error),
      resLength: responseObject ? Buffer.byteLength(util.inspect(responseObject)) : '0',
      resBody: responseObjectLog,
    };

    handleLogProperties(logObject);

    return logObject;
  } catch (error) {
    console.log(error);
    return {};
  }
}



module.exports = loggerHandler;
