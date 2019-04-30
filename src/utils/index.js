const os = require('os');
var util = require('util');
var fs = require('fs');

const logger = require('./logger');
let gradleExeFile;

// function runningInBash() {
//   return process.env.SHELL && process.env.SHELL.includes('bash');
// }

function gradleExecutable() {
  if (!gradleExeFile) {
    if (os.type() === 'Windows_NT') {
      gradleExeFile = 'gradlew.bat';
    } else {
      gradleExeFile = './gradlew';
    }
  }
  return gradleExeFile;
}

function getPackageJson(dir) {
  const packageJsonPath = `${dir ? dir + '/' : './'}package.json`;
  return util
    .promisify(fs.readFile)(packageJsonPath)
    .then(function(packageJsonBuffer) {
      return JSON.parse(packageJsonBuffer.toString());
    });
}

function handleError(error) {
  logger.error(error);
  process.exit(1);
}

function getEnvProperties(environment, parentFolder, localOnly) {
  var dotenvFilename = parentFolder + '/.env';
  var envLocal = environment ? dotenvFilename + '.' + environment + '.local' : null;
  var local = dotenvFilename + '.local';

  if(environment && localOnly) {
    return envLocal;
  }
  if(localOnly) {
    return local;
  }

  var fileNames = [
    dotenvFilename,
    local,
    environment ? dotenvFilename + '.' + environment : null,
    envLocal,
  ].filter(Boolean);

  var properties = [];

  fileNames.forEach(function(fileName) {
    if (fs.existsSync(fileName)) {
      properties.push(fileName)
    }
  });

  return properties;
}


function getGradleProperties(environment, localOnly) {
  var gradlePropPrefix = 'marklogic/gradle';
  var gradlePropSuffix = '.properties';
  var env = environment ? environment : 'local';
  var envLocal = gradlePropPrefix + '-' + env + gradlePropSuffix;

  if(localOnly) {
    return envLocal;
  }

  var fileNames = [
    gradlePropPrefix + gradlePropSuffix,
    envLocal
  ].filter(Boolean);

  var properties = [];

  fileNames.forEach(function(fileName) {
    if (fs.existsSync(fileName)) {
      properties.push(fileName)
    }
  });
  return properties;
}

function readFileLines(filename) {
  if(filename && fs.existsSync(filename)) {
    return util
      .promisify(fs.readFile)(filename)
      .then(buffer => buffer.toString().split('\n'));
  }
  return new Promise((resolve, reject) => resolve([]));
}

function configify(configMap, properyLines) {
  return properyLines
    .reduce(function(config, property) {
      var propertyArray = property.split('=');
      var key = propertyArray[0];
      var value = propertyArray[1];
      config[configMap[key]] = value;
      return config;
    }, {});
}

function read(filename, configMap) {
  return readFileLines(filename)
    .then(function(propertyLines) {
      return configify(configMap, propertyLines)
    });
}

function mergeWrite(filename, configMap, config) {
  var configKeys = Object.keys(configMap);
  var newPropertyLines = [];
  configKeys.forEach(key => {
    var value = config[configMap[key]];
    if(value) {
      newPropertyLines.push(key + '=' + value);
    }
  });
  //write combined config to environment local file
  return util.promisify(fs.writeFile)(filename, newPropertyLines.join('\n'));
}

function merge(filename, configMap, config) {
  return read(filename, configMap)
    .then(function(existingConfig) {
      return Object.assign(existingConfig, config);
    })
    .then(function(mergedConfig) {
      return mergeWrite(filename, configMap, mergedConfig);
    }).catch(handleError);
}

module.exports = {
  handleError,
  getPackageJson,
  gradleExecutable,
  logger,
  getEnvProperties,
  getGradleProperties,
  merge
};
