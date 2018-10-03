var util = require('util');
var fs = require('fs');
var handleError = require('../../utils').handleError;

// TODO: unit test
// similar to mlGradleConfigManager
function configify(properties) {
  var configMap = {
    GROVE_APP_NAME: 'mlAppName',
    GROVE_ML_HOST: 'mlHost',
    GROVE_ML_REST_PORT: 'mlRestPort',
    GROVE_APP_PORT: 'nodePort',
    GROVE_SESSION_SECRET: 'sessionSecret',
    GROVE_APP_USERS_ONLY: 'appUsersOnly',
    GROVE_DISALLOW_UPDATES: 'disallowUpdates'
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
  const nodeConfigMap = {
    GROVE_APP_NAME: config.mlAppName,
    GROVE_ML_HOST: config.mlHost,
    GROVE_ML_REST_PORT: config.mlRestPort,
    GROVE_APP_PORT: config.nodePort,
    GROVE_SESSION_SECRET: config.sessionSecret,
    GROVE_APP_USERS_ONLY: config.appUsersOnly,
    GROVE_DISALLOW_UPDATES: config.disallowUpdates
  };
  return Object.keys(nodeConfigMap).reduce(function(properties, key) {
    if (!nodeConfigMap[key]) {
      return properties;
    }
    return properties + '\n' + key + '=' + nodeConfigMap[key];
  }, '');
}

function read() {
  // TODO: make the directory where it is mounted discoverable
  // also below
  return util
    .promisify(fs.readFile)('middle-tier/.env')
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
  // TODO: make the directory where it is mounted discoverable
  // also above
  return util
    .promisify(fs.writeFile)('middle-tier/.env', propertify(config))
    .then(function() {
      return config;
    })
    .catch(handleError);
}

module.exports = {
  merge: merge,
  forceWrite: forceWrite
};
