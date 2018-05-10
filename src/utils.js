var chalk = require('chalk');

function handleError(error) {
  console.error(chalk.red('\nERROR'));
  console.error(error);
  process.exit(1);
}

module.exports = {
  handleError: handleError
};
