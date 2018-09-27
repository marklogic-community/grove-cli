const prompt = require('./prompt');
const nodeConfigManager = require('./nodeConfigManager');
const reactConfigManager = require('./reactConfigManager');
const mlGradleConfigManager = require('./mlGradleConfigManager');
const handleError = require('./utils').handleError;

function buildConfigFromUserInput(config) {
  return prompt('What host is your instance of MarkLogic running on?', {
    default: 'localhost'
  })
    .then(function(mlHost) {
      // TODO: add validation, for example, on valid ports
      // maybe even ping the port for the user
      config.mlHost = mlHost;
      return prompt(
        'What port do you want to use for your MarkLogic REST server?',
        { default: 8063 }
      );
    })
    .then(function(mlRestPort) {
      config.mlRestPort = mlRestPort;
      return prompt('What port do you want your Node server to listen on?', {
        default: 9003
      });
    })
    .then(function(nodePort) {
      config.nodePort = nodePort;
      return config;
    })
    .catch(handleError);
}

const runConfig = function runConfig(options) {
  options = options || {};
  let config = options.config || {};

  return buildConfigFromUserInput(config)
    .then(newConfig =>
      Promise.all([
        nodeConfigManager.merge(newConfig),
        reactConfigManager.merge(newConfig),
        mlGradleConfigManager.merge(newConfig)
      ])
    )
    .catch(handleError);
};

module.exports = runConfig;
