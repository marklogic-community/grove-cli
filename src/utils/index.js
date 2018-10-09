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

module.exports = {
  handleError,
  getPackageJson,
  gradleExecutable,
  logger
};
