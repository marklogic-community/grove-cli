const inquirer = require('inquirer');

const confirmAppName = program => {
  const mlAppName = program.args[0] || 'grove-app';
  if (program.confirmAppName) {
    return Promise.resolve(mlAppName);
  }
  return inquirer
    .prompt([
      {
        name: 'confirmedAppName',
        message: 'Please confirm the name of your new project',
        default: mlAppName
      }
    ])
    .then(({ confirmedAppName }) => confirmedAppName);
};

module.exports = confirmAppName;
