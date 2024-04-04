const utility = require('./../helpers/utility')

const isValidValue = (obj, key) => !(obj[key] === null ||
  obj[key] === undefined ||
  obj[key] === 'null');

const deleteEmptyProperty = (obj, key) => (!isValidValue(obj, key) && delete obj[key]);

const encryptSensitiveProperty = (obj, key) => {
  const sensitiveProperties = ['cpf', 'cnpj', 'cpf_cnpj'];
  if (isValidValue(obj, key) && sensitiveProperties.includes(key.toLowerCase())) {
    obj[key] = utility.encrypt(obj[key])
  }
}

const handleLogProperties = (obj) => {
  Object.keys(obj).forEach((key) => {
    deleteEmptyProperty(obj, key)
  })

  if (obj.body) {
    Object.keys(obj.body).forEach((key) => {
      encryptSensitiveProperty(obj.body, key)
    })
  }
}

module.exports = handleLogProperties;
