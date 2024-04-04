'use strict';

const errorConstants = require('./customErrorConstants');
const getProperty = require('../common/getProperty')

const getServiceStatusCode = (error) => (
  getProperty('statusCode', error) ||
    getProperty('response.status', error) ||
      getProperty('output.statusCode', error)
);

const getServiceResponseTime = (error) => (
  getProperty('response.headers', error) && error.response.headers['x-response-time'] ?
    error.response.headers['x-response-time'] :
    null
);

const getServiceURL = (error) => (getProperty('config.url', error));

const getServiceReference = (error) => {
  const url = getProperty('config.baseURL', error);

  if (url) {
    const sections = url.split('/');
    return sections[sections.length-1];
  }
  return null;
};

const getDefaultErrorType = (statusCode) => (
  errorConstants.DefaultErrorType[statusCode] ||
    errorConstants.ErrorType.GenericError
);

const getDefaultErrorMessage = (error, statusCode) => (
  getProperty('isBoom', error) ? 
    getProperty('message', error) :
    errorConstants.DefaultErrorType[statusCode] ?
      errorConstants.DefaultErrorType[statusCode] + ' Error' :
      errorConstants.GenericErrorMessage);

const getDefaultStatusCode = (error) => (
  getProperty('output.statusCode', error) ||
    errorConstants.StatusCode.InternalServerError);

const removeEmptyFields = (data) => {
  if (!data.additionalData) delete data.additionalData;
  if (!data.serviceResponseTime) delete data.serviceResponseTime;
  if (!data.serviceStatusCode) delete data.serviceStatusCode;
  if (!data.serviceReference) delete data.serviceReference;
  if (!data.serviceURL) delete data.serviceURL;
}

class CustomError extends Error {
  constructor({
    statusCode = null,
    message = null,
    type = null,
    subtype = null,
    additionalData = null,
    error = null,
    serviceResponseTime = null,
    serviceStatusCode = null,
    serviceURL = null,
    serviceReference = null,
  }) {
    super(message);
    this.statusCode = statusCode || getDefaultStatusCode(error);
    this.message = message || getDefaultErrorMessage(error, this.statusCode);
    this.type = type || getDefaultErrorType(this.statusCode);
    this.subtype = subtype;
    this.additionalData = additionalData;

    if (error instanceof Error) {
      this.stack = error.stack;
    }
    this.serviceResponseTime = serviceResponseTime || getServiceResponseTime(error);
    this.serviceStatusCode = serviceStatusCode || getServiceStatusCode(error);
    this.serviceURL = serviceURL || getServiceURL(error);
    this.serviceReference = serviceReference || getServiceReference(error);

    removeEmptyFields(this);
  }
  toResponseData() {
    const result = {
      error: {
        type: this.type,
        message: this.message,
        statusCode: this.statusCode,
      }
    };
    if (this.subtype) {
      result.error.subtype = this.subtype;
    }
    if (this.additionalData) {
      result.error.additionalData = this.additionalData;
    }
    return result;
  }
}

const IsCustomError = error => (error instanceof CustomError);

module.exports = {
  CustomError,
  IsCustomError,
  StatusCode: errorConstants.StatusCode,
  ErrorType: errorConstants.ErrorType,
};