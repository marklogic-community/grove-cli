var util = require('util');
var fs = require('fs');
var utils = require('../../utils');

//we only need to write the new config not get all properties in the local environment config file
function merge(config) {
  var filename = utils.getEnvProperties(config.environment, 'ui', true);
  var configMap = {
    VUE_APP_MIDDLETIER_PORT: 'nodePort'
  };
  return utils.merge(filename, configMap, config);
}

module.exports = {
  merge
};
