const childProcess = require('child_process');
const chalk = require('chalk');
const inquirer = require('inquirer');

const nodeConfigManager = require('./nodeConfigManager');
const mlGradleConfigManager = require('./mlGradleConfigManager');
const handleError = require('./utils').handleError;

const createNew = function(options) {
  options = options || {};
  const config = options.config || {};
  config.mlAppName = config.mlAppName || 'grove-app';

  const availableTemplates = {
    React:
      'https://project.marklogic.com/repo/scm/nacw/grove-react-template.git',
    Vue:
      'https://project.marklogic.com/repo/scm/~gjosten/grove-vue-template.git'
  };

  return inquirer
    .prompt([
      {
        name: 'templateName',
        type: 'list',
        message:
          'Do you want to create your Grove project with the React or the Vue UI?',
        choices: Object.keys(availableTemplates)
      }
    ])
    .then(({ templateName }) => {
      console.log(
        chalk.cyan(
          `\nGenerating a Grove Project named "${
            config.mlAppName
          }" using the Grove ${templateName} UI, the Grove Node middle-tier, and ml-gradle...`
        )
      );

      const templateRepoUrl = availableTemplates[templateName];
      // TODO: log to winston?
      childProcess.execSync(
        `git clone --recurse-submodules ${templateRepoUrl} ${
          config.development ? '-b development ' : ''
        } ${config.mlAppName}`
      );

      // Any subsequent actions should happen in context of the new app
      process.chdir(config.mlAppName);

      var writeNodeConfigPromise = nodeConfigManager.merge(config);
      var writeMlGradleConfigPromise = mlGradleConfigManager.merge(config);

      return Promise.all([writeNodeConfigPromise, writeMlGradleConfigPromise])
        .then(function() {
          return config;
        })
        .catch(handleError);
    });
};

module.exports = createNew;
