const inquirer = require('inquirer');

var confirmAppName = function(mlAppName) {
  mlAppName = mlAppName || 'grove-app';
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
