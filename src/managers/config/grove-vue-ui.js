var util = require('util');
var fs = require('fs');
var handleError = require('../../utils').handleError;

const configify = properties => {
  const configMap = {
    VUE_APP_MIDDLETIER_PORT: 'nodePort'
  };
  return properties
    .toString()
    .split('\n')
    .reduce((config, property) => {
      const propertyArray = property.split('=');
      const key = propertyArray[0];
      const value = propertyArray[1];
      config[configMap[key]] = value;
      return config;
    });
};

const propertify = config => {
  const configMap = {
    VUE_APP_MIDDLETIER_PORT: config.nodePort
  };
  return Object.keys(configMap).reduce((properties, key) => {
    if (!configMap[key]) {
      return properties;
    }
    return properties + '\n' + key + '=' + configMap[key];
  }, '');
};

const read = () => {
  return util
    .promisify(fs.readFile)('ui/.env')
    .then(configify)
    .catch(function(error) {
      if (error.code === 'ENOENT') {
        return {};
      }
      handleError(error);
    });
};

const merge = config => {
  return read()
    .then(existingConfig => {
      return Object.assign(existingConfig, config);
    })
    .then(forceWrite)
    .catch(handleError);
};

const forceWrite = config => {
  return util
    .promisify(fs.writeFile)('ui/.env', propertify(config))
    .then(() => config)
    .catch(handleError);
};

module.exports = {
  merge
};
