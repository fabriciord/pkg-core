const { genericSuccess } = require('./genericSuccess');
const { genericError } = require('./genericError');

module.exports = {
  successHandler: (log) => genericSuccess(log),
  errorHandler: (log) => genericError(log),
}