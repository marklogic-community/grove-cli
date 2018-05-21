var util = require('util');
var fs = require('fs');
var handleError = require('./utils').handleError;

// TODO: unit test
// similar to nodeConfigManager
function configify(propertyLines) {
  const assignConfigFields = line => {
    if (line.startsWith('mlAppName=')) {
      config.mlAppName = line.split('=')[1];
    }
  };
  let config = {};
  propertyLines.forEach(assignConfigFields);
  return config;
}

function readFileLines() {
  return util
    .promisify(fs.readFile)('marklogic/gradle.properties')
    .then(buffer => buffer.toString().split('\n'));
}

function read() {
  return readFileLines()
    .then(configify)
    .catch(function(error) {
      if (error.code === 'ENOENT') {
        console.warn(
          'WARNING: marklogic/gradle.properties file does not exist'
        );
        return {};
      }
      handleError(error);
    });
}

// TODO: write non-existent properties relevant to ml-gradle??
// TODO: think about a section dedicated to muir, might be easier
function mergeWrite(config) {
  let configKeys = Object.keys(config);
  const overwritePropertiesWithConfig = line => {
    configKeys.forEach(key => {
      if (line.startsWith(key + '=')) {
        configKeys = configKeys.filter(k => k !== key);
        line = key + '=' + config[key];
      }
    });
    return line;
  };
  return readFileLines()
    .then(propertyLines => propertyLines.map(overwritePropertiesWithConfig))
    .then(newPropertyLines => {
      util.promisify(fs.writeFile)(
        'marklogic/gradle.properties',
        newPropertyLines.join('\n')
      );
    });
}

// TODO: preserve comments, unrelated settings
function merge(config) {
  return read()
    .then(function(existingConfig) {
      return Object.assign(existingConfig, config);
    })
    .then(mergeWrite)
    .catch(handleError);
}

module.exports = {
  merge: merge
};
