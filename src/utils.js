const chalk = require('chalk');
const os = require('os');
let gradleExeFile;

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
  console.error(chalk.red('\nERROR'));
  console.error(error);
  process.exit(1);
}

module.exports = {
  handleError: handleError,
  gradleExecutable: gradleExecutable
};
