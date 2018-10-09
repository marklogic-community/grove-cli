const inquirer = require('inquirer');

const nodeConfigManager = require('./managers/config/grove-node');
const mlGradleConfigManager = require('./managers/config/grove-ml-gradle');

const utils = require('./utils');
const logger = utils.logger;

const configManagers = {
  'grove-react-ui': './managers/config/grove-react-ui',
  'grove-vue-ui': './managers/config/grove-vue-ui'
};

function buildConfigFromUserInput(config) {
  const questions = [
    {
      name: 'mlHost',
      message: 'What host is your instance of MarkLogic running on?',
      default: 'localhost'
      // TODO: validate hostname?
    },
    {
      name: 'mlRestPort',
      message: 'What port do you want to use for your MarkLogic REST server?',
      default: 8063
      // TODO: validate port; maybe even ping hostname + port?
    },
    {
      name: 'nodePort',
      message: 'What port do you want your Grove Node server to listen on?',
      default: 9003
      // TODO: validate port
    }
  ];
  // TODO: read current config on disk first and use it for defaults and
  // warn if there is a conflict
  return (
    inquirer
      // only ask questions without answers already in config
      .prompt(questions.filter(question => !config[question.name]))
      .then(answers => {
        return Object.assign(config, answers);
      })
  );
}

const locateUIConfigManager = () => {
  const noop = { merge: () => {} };
  return utils.getPackageJson('ui').then(({ grove }) => {
    if (!grove || !grove.templateID) {
      logger.warn(
        'The ui/ directory does not specify a grove.templateID in package.json. No configuration will be applied to the UI application.'
      );
      return noop;
    }
    if (!configManagers[grove.templateID]) {
      logger.warn(
        `The ui/ directory specifies a grove.templateID in package.json of ${
          grove.templateID
        }, which is unknown to the grove-cli. No configuration will be applied to the UI application.`
      );
      return noop;
    }

    return require(configManagers[grove.templateID]);
  });
};

const runConfig = function runConfig(options) {
  options = options || {};
  let config = options.config || {};

  let uiConfigManager;
  return locateUIConfigManager()
    .then(manager => (uiConfigManager = manager))
    .then(buildConfigFromUserInput.bind(this, config))
    .then(newConfig => {
      return Promise.all([
        nodeConfigManager.merge(newConfig),
        uiConfigManager.merge(newConfig),
        mlGradleConfigManager.merge(newConfig)
      ]);
    })
    .catch(utils.handleError);
};

module.exports = runConfig;
