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
  return inquirer
    .prompt([
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
        message: 'What port do you want your Node server to listen on?',
        default: 9003
        // TODO: validate port
      }
    ])
    .then(answers => {
      return Object.assign(config, answers);
    });
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
    .then(buildConfigFromUserInput.bind(config))
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
