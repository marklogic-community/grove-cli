var util = require('util');
var fs = require('fs');

const utils = require('../../utils');
var URL = require('url').URL;

function read() {
  return utils
    .getPackageJson('ui')
    .then(function(packageJson) {
      var config;
      var proxy = packageJson.proxy;
      if (proxy) {
        var proxyUrl = new URL(proxy);
        config = {
          nodePort: proxyUrl.port,
          nodeHost: proxyUrl.hostname
        };
      } else {
        config = {};
      }
      return config;
    })
    .catch(utils.handleError);
}

function forceWrite(config) {
  return utils
    .getPackageJson('ui')
    .then(function(packageJson) {
      packageJson.proxy = 'http://' + config.nodeHost + ':' + config.nodePort;
      return util.promisify(
        fs.writeFile
      )('ui/package.json', JSON.stringify(packageJson, null, 2));
    })
    .then(function() {
      return config;
    })
    .catch(utils.handleError);
}

function merge(config) {
  return read()
    .then(function(existingConfig) {
      var defaultConfig = {
        nodeHost: 'localhost',
        nodePort: 9003
      };
      return Object.assign(defaultConfig, existingConfig, config);
    })
    .then(forceWrite)
    .catch(utils.handleError);
}

module.exports = {
  merge: merge
};
