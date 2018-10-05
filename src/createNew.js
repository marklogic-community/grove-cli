const childProcess = require('child_process');
const chalk = require('chalk');
const inquirer = require('inquirer');

const nodeConfigManager = require('./managers/config/grove-node');
const mlGradleConfigManager = require('./managers/config/grove-ml-gradle');
const handleError = require('./utils').handleError;

const availableTemplates = [
  {
    id: 'grove-react-template',
    name: 'React',
    repo: 'https://project.marklogic.com/repo/scm/nacw/grove-react-template.git'
  },
  {
    id: 'grove-vue-template',
    name: 'Vue',
    repo:
      'https://project.marklogic.com/repo/scm/~gjosten/grove-vue-template.git'
  }
];

const identifyTemplate = templateID => {
  if (templateID) {
    const template = availableTemplates.find(availableTemplate => {
      return availableTemplate.id === templateID;
    });
    if (template) {
      return Promise.resolve(template);
    }
    console.log(chalk.red(`\nIgnoring the unknown template "${templateID}".`));
  }
  return inquirer
    .prompt([
      {
        name: 'template',
        type: 'list',
        message:
          'Do you want to create your Grove project with the React or the Vue UI?',
        choices: availableTemplates.map(template => {
          return {
            name: template.name,
            value: template
          };
        })
      }
    ])
    .then(({ template }) => template);
};

const createNew = function(options) {
  options = options || {};
  const program = options.program;
  const config = options.config || {};
  config.mlAppName = config.mlAppName || 'grove-app';

  return identifyTemplate(program.template).then(template => {
    console.log(
      chalk.cyan(
        `\nGenerating a Grove Project named "${
          config.mlAppName
        }" using the Grove ${
          template.name
        } UI, the Grove Node middle-tier, and ml-gradle...`
      )
    );

    // TODO: log to winston?
    childProcess.execSync(
      `git clone --recurse-submodules ${template.repo} ${
        program.templateRelease ? `-b ${program.templateRelease} ` : ''
      } ${config.mlAppName}`
    );

    // Any subsequent actions should happen in context of the new app
    process.chdir(config.mlAppName);

    if (program.keepGit) {
      childProcess.execSync('git remote rename origin upstream');

      childProcess.execSync(
        'git submodule foreach "git remote rename origin upstream"'
      );
    } else {
      childProcess.execSync('rm -rf .git .gitmodules */.git');
      childProcess.execSync('git init');
      childProcess.execSync('git add .');
      childProcess.execSync('git commit -m "Initial commit by grove cli"');
    }

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
