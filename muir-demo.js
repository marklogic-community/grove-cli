#!/usr/bin/env node
var program = require('commander');
var fs = require('fs');
var childProcess = require('child_process');

var confirmAppName = require('./src/confirmAppName');
var createNew = require('./src/createNew');
var runConfig = require('./src/runConfig');

// TODO: move logs into logs/
var logfile = 'muir-demo.log';

program.parse(process.argv);
confirmAppName(program.args[0]).then(function(mlAppName) {
  var configFromCreateNew = {};
  var createNewPromise = createNew({
    config: {
      mlAppName: mlAppName
    },
    logfile: logfile
  }).then(
    function(config) {
      configFromCreateNew = config;
    },
    function(error) {
      throw error;
    }
  );

  console.log(
    "\nWhile we are provisioning your app, which might take a while, let's be sure we have all the information we need for the next step."
  );
  var configFromRunConfig = {};
  var runConfigPromise = runConfig({ logfile: logfile }).then(
    function(config) {
      configFromRunConfig = config;
    },
    function(error) {
      console.error(error);
      process.exit(1);
    }
  );

  Promise.all([createNewPromise, runConfigPromise]).then(
    function() {
      var config = Object.assign({}, configFromCreateNew, configFromRunConfig);
      console.log(
        '\nProvisioning your MarkLogic database. This might take a while ...'
      );
      var gradleFlags =
        ' -PmlAppName=' +
        config.mlAppName +
        ' -PmlHost=' +
        config.mlHost +
        ' -PmlRestPort=' +
        config.mlRestPort;
      process.chdir('marklogic');
      childProcess.execSync('./gradlew mlDeploy' + gradleFlags, {
        stdio: [0, fs.openSync(logfile, 'w'), fs.openSync(logfile, 'w')]
      });

      console.log('\nLoading sample data');
      childProcess.execSync('./gradlew loadSampleData' + gradleFlags, {
        stdio: [0, fs.openSync(logfile, 'w'), fs.openSync(logfile, 'w')]
      });
      process.chdir('..');

      console.log('\nRunning your application');
      var runningApp = childProcess.spawn('npm', ['start']);
      runningApp.stdout.on('data', function(data) {
        console.log(data.toString());
      });
      runningApp.stderr.on('data', function(data) {
        console.log(data.toString());
      });
      runningApp.on('exit', function(code) {
        console.log('Your application exited with code ' + code.toString());
      });
    },
    function(error) {
      console.error(error);
      process.exit(1);
    }
  );
});
