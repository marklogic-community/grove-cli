var util = require('util');
var fs = require('fs');
var utils = require('../../utils');

//we only need to write the new config not get all properties in the local environment config file
function merge(config) {
  var filename = utils.getGradleProperties(config.environment, true);
  var configMap = {
    'mlAppName' : 'mlAppName',
    'mlHost' : 'mlHost',
    'mlRestPort' : 'mlRestPort',
    'environment' : 'environment'
  };
  return utils.merge(filename, configMap, config);
}

module.exports = {
  merge: merge
};
