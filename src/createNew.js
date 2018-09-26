var fs = require('fs');
var util = require('util');
var childProcess = require('child_process');
var chalk = require('chalk');

var nodeConfigManager = require('./nodeConfigManager');
var mlGradleConfigManager = require('./mlGradleConfigManager');
var handleError = require('./utils').handleError;

var createNew = function(options) {
  options = options || {};
  var logfile = options.logfile || 'muir-new.log';
  var config = options.config || {};
  config.mlAppName = config.mlAppName || 'muir-app';

  console.log(
    chalk.cyan(
      '\nGenerating a MUIR Project named "' +
        config.mlAppName +
        '" using the MUIR React UI, the MUIR Node middle-tier, and ml-gradle...'
    )
  );
  // TODO: log to a logfile?
  childProcess.execSync(
    'git clone --recurse-submodules https://project.marklogic.com/repo/scm/nacw/muir-react-reference.git ' +
      (config.development ? '-b development ' : '') +
      config.mlAppName
  );

  // Any subsequent actions should happen in context of the new app
  process.chdir(config.mlAppName);

  var writeNodeConfigPromise = nodeConfigManager.merge(config);
  var writeMlGradleConfigPromise = mlGradleConfigManager.merge(config);

  console.log(
    chalk.cyan(
      '\nProvisioning your Muir Project with all dependencies. This may take a minute...'
    )
  );
  var npmInstallPromise = util
    .promisify(childProcess.exec)('npm install')
    .then(function(stdout, stderr) {
      fs.appendFile(logfile, '\nlogging stdout:\n' + stdout, function(error) {
        if (error) throw error;
      });
      fs.appendFile(logfile, '\nlogging stderr:\n' + stderr, function(error) {
        if (error) throw error;
      });
    });

  return Promise.all([
    writeNodeConfigPromise,
    writeMlGradleConfigPromise,
    npmInstallPromise
  ])
    .then(function() {
      return config;
    })
    .catch(handleError);
};

module.exports = createNew;
