var prompt = require('./prompt');
var nodeConfigManager = require('./nodeConfigManager');
var handleError = require('./utils').handleError;

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

var runConfig = function runConfig(options) {
  options = options || {};
  var logfile = options.logfile || 'muir-new.log';
  var config = options.config || {};

  return buildConfigFromUserInput(config)
    .then(nodeConfigManager.merge)
    .catch(handleError);
};

module.exports = runConfig;
