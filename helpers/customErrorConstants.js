'use strict';

const StatusCode = Object.freeze({
  OK: 200,
  Created: 201,
  Accepted: 202,
  NonAuthoritativeInformation: 203,
  NoContent: 204,
  ResetContent: 205,
  PartialContent: 206,
  MultiStatus: 207,
  AlreadyReported: 208,
  IMUsed: 226,
  MultipleChoices: 300,
  MovedPermanently: 301,
  Found: 302,
  SeeOther: 303,
  NotModified: 304,
  UseProxy: 305,
  TemporaryRedirect: 307,
  PermanentRedirect: 308,
  BadRequest: 400,
  Unauthorized: 401,
  PaymentRequired: 402,
  Forbidden: 403,
  NotFound: 404,
  MethodNotAllowed: 405,
  NotAcceptable: 406,
  ProxyAuthenticationRequired: 407,
  RequestTimeout: 408,
  Conflict: 409,
  Gone: 410,
  LengthRequired: 411,
  PreconditionFailed: 412,
  PayloadTooLarge: 413,
  URITooLong: 414,
  UnsupportedMediaType: 415,
  RangeNotSatisfiable: 416,
  ExpectationFailed: 417,
  MisdirectedRequest: 421,
  UnprocessableEntity: 422,
  Locked: 423,
  FailedDependency: 424,
  TooEarly: 425,
  UpgradeRequired: 426,
  PreconditionRequired: 428,
  TooManyRequests: 429,
  RequestHeaderFieldsTooLarge: 431,
  UnavailableForLegalReasons: 451,
  InternalServerError: 500,
  NotImplemented: 501,
  BadGateway: 502,
  ServiceUnavailable: 503,
  GatewayTimeout: 504,
  HTTPVersionNotSupported: 505,
  VariantAlsoNegotiates: 506,
  InsufficientStorage: 507,
  LoopDetected: 508,
  NotExtended: 510,
  NetworkAuthenticationRequired: 511,
});

const ErrorType = Object.freeze({
  // HTTP Standard Errors
  BadRequest: 'BadRequest', // Erro HTTP de BadRequest (400)
  Unauthorized: 'Unauthorized', // Erro HTTP de Unauthorized (401)
  PaymentRequired: 'PaymentRequired', // Erro HTTP de PaymentRequired (402)
  Forbidden: 'Forbidden', // Erro HTTP de Forbidden (403)
  NotFound: 'NotFound', // Erro HTTP de NotFound (404)
  MethodNotAllowed: 'MethodNotAllowed', // Erro HTTP de MethodNotAllowed (405)
  NotAcceptable: 'NotAcceptable', // Erro HTTP de NotAcceptable (406)
  ProxyAuthenticationRequired: 'ProxyAuthenticationRequired', // Erro HTTP de ProxyAuthenticationRequired (407)
  RequestTimeout: 'RequestTimeout', // Erro HTTP de RequestTimeout (408)
  Conflict: 'Conflict', // Erro HTTP de Conflict (409)
  Gone: 'Gone', // Erro HTTP de Gone (410)
  LengthRequired: 'LengthRequired', // Erro HTTP de LengthRequired (411)
  PreconditionFailed: 'PreconditionFailed', // Erro HTTP de PreconditionFailed (412)
  PayloadTooLarge: 'PayloadTooLarge', // Erro HTTP de PayloadTooLarge (413)
  URITooLong: 'URITooLong', // Erro HTTP de URITooLong (414)
  UnsupportedMediaType: 'UnsupportedMediaType', // Erro HTTP de UnsupportedMediaType (415)
  RangeNotSatisfiable: 'RangeNotSatisfiable', // Erro HTTP de RangeNotSatisfiable (416)
  ExpectationFailed: 'ExpectationFailed', // Erro HTTP de ExpectationFailed (417)
  MisdirectedRequest: 'MisdirectedRequest', // Erro HTTP de MisdirectedRequest (421)
  UnprocessableEntity: 'UnprocessableEntity', // Erro HTTP de UnprocessableEntity (422)
  Locked: 'Locked', // Erro HTTP de Locked (423)
  FailedDependency: 'FailedDependency', // Erro HTTP de FailedDependency (424)
  TooEarly: 'TooEarly', // Erro HTTP de TooEarly (425)
  UpgradeRequired: 'UpgradeRequired', // Erro HTTP de UpgradeRequired (426)
  PreconditionRequired: 'PreconditionRequired', // Erro HTTP de PreconditionRequired (428)
  TooManyRequests: 'TooManyRequests', // Erro HTTP de TooManyRequests (429)
  RequestHeaderFieldsTooLarge: 'RequestHeaderFieldsTooLarge', // Erro HTTP de RequestHeaderFieldsTooLarge (431)
  UnavailableForLegalReasons: 'UnavailableForLegalReasons', // Erro HTTP de UnavailableForLegalReasons (451)
  InternalServerError: 'InternalServerError', // Erro HTTP de InternalServerError (500)
  NotImplemented: 'NotImplemented', // Erro HTTP de NotImplemented (501)
  BadGateway: 'BadGateway', // Erro HTTP de BadGateway (502)
  ServiceUnavailable: 'ServiceUnavailable', // Erro HTTP de ServiceUnavailable (503)
  GatewayTimeout: 'GatewayTimeout', // Erro HTTP de GatewayTimeout (504)
  HTTPVersionNotSupported: 'HTTPVersionNotSupported', // Erro HTTP de HTTPVersionNotSupported (505)
  VariantAlsoNegotiates: 'VariantAlsoNegotiates', // Erro HTTP de VariantAlsoNegotiates (506)
  InsufficientStorage: 'InsufficientStorage', // Erro HTTP de InsufficientStorage (507)
  LoopDetected: 'LoopDetected', // Erro HTTP de LoopDetected (508)
  NotExtended: 'NotExtended', // Erro HTTP de NotExtended (510)
  NetworkAuthenticationRequired: 'NetworkAuthenticationRequired', // Erro HTTP de NetworkAuthenticationRequired (511)
  
  // Other Errors
  GenericError: 'GenericError', // CustomError não classificado
  ParseError: 'ParseError', // Erro ao parsear objeto
  ResourceEmpty: 'ResourceEmpty', // Recurso (Serviço, Banco de Dados, etc) não retornou dados onde isso era requerido
  ResourceUnavailable: 'ResourceUnavailable', // Acesso a Recurso (Serviço, Banco de Dados, etc) falhou
  TimeOut: 'TimeOut', // Acesso a Recurso resultou em time-out
});

const DefaultErrorType = {
  400: ErrorType.BadRequest,
  401: ErrorType.Unauthorized,
  402: ErrorType.PaymentRequired,
  403: ErrorType.Forbidden,
  404: ErrorType.NotFound,
  405: ErrorType.MethodNotAllowed,
  406: ErrorType.NotAcceptable,
  407: ErrorType.ProxyAuthenticationRequired,
  408: ErrorType.RequestTimeout,
  409: ErrorType.Conflict,
  410: ErrorType.Gone,
  411: ErrorType.LengthRequired,
  412: ErrorType.PreconditionFailed,
  413: ErrorType.PayloadTooLarge,
  414: ErrorType.URITooLong,
  415: ErrorType.UnsupportedMediaType,
  416: ErrorType.RangeNotSatisfiable,
  417: ErrorType.ExpectationFailed,
  421: ErrorType.MisdirectedRequest,
  422: ErrorType.UnprocessableEntity,
  423: ErrorType.Locked,
  424: ErrorType.FailedDependency,
  425: ErrorType.TooEarly,
  426: ErrorType.UpgradeRequired,
  428: ErrorType.PreconditionRequired,
  429: ErrorType.TooManyRequests,
  431: ErrorType.RequestHeaderFieldsTooLarge,
  451: ErrorType.UnavailableForLegalReasons,
  // 500: ErrorType.InternalServerError, // Forçar default para GenericError
  501: ErrorType.NotImplemented,
  // 502: ErrorType.BadGateway, // Forçar default para GenericError
  503: ErrorType.ServiceUnavailable,
  504: ErrorType.GatewayTimeout,
  505: ErrorType.HTTPVersionNotSupported,
  506: ErrorType.VariantAlsoNegotiates,
  507: ErrorType.InsufficientStorage,
  508: ErrorType.LoopDetected,
  510: ErrorType.NotExtended,
  511: ErrorType.NetworkAuthenticationRequired,
}

const GenericErrorMessage = 'Generic Error';

module.exports = {
  StatusCode,
  ErrorType,
  GenericErrorMessage,
  DefaultErrorType,
};