var util = require('util');
var fs = require('fs');
var handleError = require('./utils').handleError;

// TODO: unit test
function configify(properties) {
  var configMap = {
    MUIR_APP_NAME: 'mlAppName',
    MUIR_ML_HOST: 'mlHost',
    MUIR_ML_REST_PORT: 'mlRestPort',
    MUIR_APP_PORT: 'nodePort',
    MUIR_SESSION_SECRET: 'sessionSecret',
    MUIR_APP_USERS_ONLY: 'appUsersOnly',
    MUIR_DISALLOW_UPDATES: 'disallowUpdates'
  };
  return properties
    .toString()
    .split('\n')
    .reduce(function(config, property) {
      var propertyArray = property.split('=');
      var key = propertyArray[0];
      var value = propertyArray[1];
      config[configMap[key]] = value;
      return config;
    }, {});
}

// TODO: unit test
function propertify(config) {
  nodeConfigMap = {
    MUIR_APP_NAME: config.mlAppName,
    MUIR_ML_HOST: config.mlHost,
    MUIR_ML_REST_PORT: config.mlRestPort,
    MUIR_APP_PORT: config.nodePort,
    MUIR_SESSION_SECRET: config.sessionSecret,
    MUIR_APP_USERS_ONLY: config.appUsersOnly,
    MUIR_DISALLOW_UPDATES: config.disallowUpdates
  };
  return Object.keys(nodeConfigMap).reduce(function(properties, key) {
    if (!nodeConfigMap[key]) {
      return properties;
    }
    return properties + '\n' + key + '=' + nodeConfigMap[key];
  }, '');
}

function read() {
  return util
    .promisify(fs.readFile)('server/.env')
    .then(configify)
    .catch(function(error) {
      if (error.code === 'ENOENT') {
        return {};
      }
      handleError(error);
    });
}

function merge(config) {
  return read()
    .then(function(existingConfig) {
      return Object.assign(existingConfig, config);
    })
    .then(forceWrite)
    .catch(handleError);
}

function forceWrite(config) {
  return util
    .promisify(fs.writeFile)('server/.env', propertify(config))
    .then(function() {
      return config;
    })
    .catch(handleError);
}

module.exports = {
  merge: merge,
  forceWrite: forceWrite
};
