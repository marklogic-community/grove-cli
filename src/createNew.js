const execSync = require('child_process').execSync;
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

const isInGitRepository = () => {
  try {
    execSync('git rev-parse --is-inside-work-tree', { stdio: 'ignore' });
    return true;
  } catch (e) {
    return false;
  }
};

const isInMercurialRepository = () => {
  try {
    execSync('hg --cwd . root', { stdio: 'ignore' });
    return true;
  } catch (e) {
    return false;
  }
};

const tryGitInit = () => {
  let didInit = false;
  try {
    execSync('git --version', { stdio: 'ignore' });
    if (isInGitRepository() || isInMercurialRepository()) {
      return false;
    }

    execSync('git init', { stdio: 'ignore' });
    didInit = true;

    execSync('git add -A', { stdio: 'ignore' });
    execSync('git commit -m "Initial commit from Grove CLI"', {
      stdio: 'ignore'
    });
    return true;
  } catch (e) {
    if (didInit) {
      // If we successfully initialized but couldn't commit,
      // maybe the commit author config is not set.
      // remove the Git files to avoid a half-done state.
      try {
        execSync('rm -rf .git');
      } catch (removeErr) {
        // Ignore.
      }
    }
    return false;
  }
};

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
    execSync(
      `git clone --recurse-submodules ${template.repo} ${
        program.templateRelease ? `-b ${program.templateRelease} ` : ''
      } ${config.mlAppName}`
    );

    // Any subsequent actions should happen in context of the new app
    process.chdir(config.mlAppName);

    if (program.git === 'keep') {
      execSync('git remote rename origin upstream');

      execSync('git submodule foreach "git remote rename origin upstream"');
    } else {
      execSync('rm -rf .git .gitmodules */.git');
      if (!(program.git === 'false' || program.git === false)) {
        if (tryGitInit()) {
          console.log('Initialized a new git repository');
        }
      }
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
