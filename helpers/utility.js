'use strict';

const moment = require('moment');
const crypto = require('crypto');
const removeAccents = require('remove-accents');

const ignoredKeys = require('../common/ignoredKeys')
const getProperty = require('../common/getProperty');

var algorithm = 'aes256';
var key = '31460b08fe4f95004617c9d4b5de4ffee0affb43';

module.exports = class Utility {
  static nowMoment() {
    var date = new Date();
    date = date.toGMTString();
    date = new Date(date);
    date = new Date(date.getTime() + (date.getTimezoneOffset() * 60 * 1000));
    return new moment(date).subtract(process.env.UTC_TIME, 'h');
  }

  static now() {
    return Utility.nowMoment().toDate();
  }

  static nowFormat(format) {
    return Utility.nowMoment().format(format);
  }

  static nowAddDaysFormat(days, format) {
    return Utility.nowMoment().add(days, 'days').format(format);
  }

  static nowAddHoursFormat(hours, format) {
    return Utility.nowMoment().add(hours, 'hours').format(format);
  }

  static parseInt(value) {
    if (value == null || value.length == 0) return 0;
    let retValue = parseInt(value);
    if (isNaN(retValue)) return 0;

    return retValue;
  }

  static isNullOrEmpty(obj) {
    if (obj == null || obj == "") {
      return true;
    }

    return false;
  }

  static trim(string) {
    return string.replace(/^\s+|\s+$/g, "");
  }

  static dateDiff(firstDate, thenDate, unit = "s") {
    firstDate = moment(firstDate);
    thenDate = moment(thenDate);

    if (!firstDate || !thenDate || !firstDate.isValid() || !thenDate.isValid()) {
      return 0
    }

    let diff = moment.duration(firstDate.diff(thenDate))

    return diff.as(unit)
  }

  static sha1(input) {
    return crypto.createHash('sha1').update(JSON.stringify(input)).digest('hex')
  }

  static lowerCaseRemoveAccents(value) {
    if (value != null) {
      return Utility.removeSpecialCharacters(removeAccents(value).toLowerCase());
    }

    return null;
  }

  static removeSpecialCharacters(s) {
    return s.replace(/[^\w\s]/gi, '');
  }

  static removeIdFromObjInsideArray(arr) {
    let newArray = [];

    if (arr != null) {
      for (var i = 0; i < arr.length; i++) {
        let copy = JSON.parse(JSON.stringify(arr[i]));
        delete copy._id;
        newArray.push(copy);
      }
    }

    return newArray;
  }

  static encrypt(data) {
    var cipher = crypto.createCipher(algorithm, key);

    return cipher.update(data, 'utf8', 'hex') + cipher.final('hex');
  }

  static decrypt(data) {
    var decipher = crypto.createDecipher(algorithm, key);

    return decipher.update(data, 'hex', 'utf8') + decipher.final('utf8');
  }

  static stringFormatter(str) {
    let args = [].slice.call(arguments, 1),
      i = 0;

    return str.replace(/%@/g, function () {
      return args[i++];
    });
  }

  static normalizeProperties(obj, execptions = []) {
    if (!obj) return {};

    const keys = Object.keys(obj);
    const ignoredObjectKeys = ignoredKeys.filter(key => !execptions.includes(key));
    const validKeys = keys.filter(key => !ignoredObjectKeys.includes(key.toLowerCase()));

    return validKeys.reduce((acc, key) => (acc[key.toLowerCase()] = obj[key], acc), {});
  }

  static getProperty(path, obj) {
    return getProperty(path, obj);
  }

  /**
   * Codifica os caracteres de um dos valores de campos de um objeto que são considerados proibidos pela função
   * Para adicionar novos caractéres basta adicionar uma nova string ao array e a expressão do regex
   *
   * @param obj
   */
  static encodeForbiddenCharacters(obj) {
    const searchRegExp = /[|]/g;
    const forbiddenChars = ['|'];

    Object.entries(obj).forEach(([key, fieldValue]) => {
      if (typeof fieldValue === 'string') {
        forbiddenChars.forEach(v => {
          if (fieldValue.includes(v)) {
            const replacedString = fieldValue.replace(searchRegExp, encodeURIComponent('|'));

            Object.assign(obj, { [key]: replacedString })
          }
        });
      }
    });
  }
}
