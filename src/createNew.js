var fs = require('fs');
var util = require('util');
var childProcess = require('child_process');
var chalk = require('chalk');

var nodeConfigManager = require('./nodeConfigManager');

var createNew = function(options) {
  options = options || {};
  var logfile = options.logfile || 'muir-new.log';
  var config = options.config || {};
  config.mlAppName = config.mlAppName || 'muir-app';

  console.log(
    chalk.blue(
      '\nGenerating a MUIR application named "' +
        config.mlAppName +
        '" using React and a Node Express.js middle-tier.'
    )
  );
  // TODO: log to a logfile?
  childProcess.execSync(
    'git clone --recursive ssh://git@project.marklogic.com:7999/nacw/muir.git ' +
      config.mlAppName
  );

  // Any subsequent actions should happen in context of the new app
  process.chdir(config.mlAppName);

  var writeConfigPromise = nodeConfigManager.merge(config);

  console.log(
    chalk.blue('Provisioning your React application and Node middle-tier')
  );
  var npmInstallPromise = util
    .promisify(childProcess.exec)('npm install')
    .then(
      function(stdout, stderr) {
        fs.appendFile(logfile, '\nlogging stdout:\n' + stdout, function(error) {
          if (error) throw error;
        });
        fs.appendFile(logfile, '\nlogging stderr:\n' + stderr, function(error) {
          if (error) throw error;
        });
      },
      function(error) {
        throw error;
      }
    );

  return Promise.all([writeConfigPromise, npmInstallPromise]).then(
    function() {
      return config;
    },
    function(error) {
      throw error;
    }
  );
};

module.exports = createNew;
