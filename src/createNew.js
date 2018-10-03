const childProcess = require('child_process');
const chalk = require('chalk');
const inquirer = require('inquirer');

const nodeConfigManager = require('./managers/config/grove-node');
const mlGradleConfigManager = require('./managers/config/grove-ml-gradle');
const handleError = require('./utils').handleError;

const createNew = function(options) {
  options = options || {};
  const config = options.config || {};
  config.mlAppName = config.mlAppName || 'grove-app';

  const availableTemplates = {
    React:
      'https://project.marklogic.com/repo/scm/nacw/grove-react-template.git -b GROVE-149-add-vue-to-cli',
    Vue:
      'https://project.marklogic.com/repo/scm/~gjosten/grove-vue-template.git -b GROVE-149-add-vue-to-cli'
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
