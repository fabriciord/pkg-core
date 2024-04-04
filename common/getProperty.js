'use strict';

const get = (obj, prop, ...props) => {
  if (!obj)
    return null;

  const val = obj[prop];

  if (!props.length || !val) {
    return val;
  }
  return get(val, ...props);
};

const propertyPathToArray = (path = '') => path.replace(/\[/g, '.').replace(/\]/g, '').split('.');

const prop = (path, obj) => get(obj, ...propertyPathToArray(path));

module.exports = prop;
