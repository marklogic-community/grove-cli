var util = require('util');
var fs = require('fs');
var utils = require('../../utils');

//we only need to write the new config not get all properties in the local environment config file
function merge(config) {
  var filename = utils.getEnvProperties(config.environment, 'middle-tier', true);
  var configMap = {
    GROVE_APP_NAME: 'mlAppName',
    GROVE_ML_HOST: 'mlHost',
    GROVE_ML_REST_PORT: 'mlRestPort',
    GROVE_APP_PORT: 'nodePort',
    GROVE_SESSION_SECRET: 'sessionSecret',
    GROVE_APP_USERS_ONLY: 'appUsersOnly',
    GROVE_DISALLOW_UPDATES: 'disallowUpdates'
  };
  return utils.merge(filename, configMap, config);
}

module.exports = {
  merge: merge
};
