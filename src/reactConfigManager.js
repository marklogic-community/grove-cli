var util = require('util');
var fs = require('fs');
var handleError = require('./utils').handleError;
var URL = require('url').URL;

function getPackageJson() {
  return util
    .promisify(fs.readFile)('ui/package.json')
    .then(function(packageJsonBuffer) {
      return JSON.parse(packageJsonBuffer.toString());
    });
}

function read() {
  return getPackageJson()
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
    .catch(handleError);
}

function forceWrite(config) {
  return getPackageJson()
    .then(function(packageJson) {
      packageJson.proxy = 'http://' + config.nodeHost + ':' + config.nodePort;
      return util.promisify(
        fs.writeFile
      )('ui/package.json', JSON.stringify(packageJson, null, 2));
    })
    .then(function() {
      return config;
    })
    .catch(handleError);
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
    .catch(handleError);
}

module.exports = {
  merge: merge
};
