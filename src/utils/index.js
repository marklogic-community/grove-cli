const os = require('os');
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

function handleError(error) {
  logger.error(error);
  process.exit(1);
}

module.exports = {
  handleError,
  gradleExecutable,
  logger
};
