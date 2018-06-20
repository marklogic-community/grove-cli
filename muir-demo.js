#!/usr/bin/env node
require('./src/init');

var program = require('commander');
var fs = require('fs');
var childProcess = require('child_process');
var chalk = require('chalk');

var confirmAppName = require('./src/confirmAppName');
var createNew = require('./src/createNew');
var runConfig = require('./src/runConfig');
var handleError = require('./src/utils').handleError;

// TODO: move logs into logs/
var logfile = 'muir-demo.log';

program.parse(process.argv);
confirmAppName(program.args[0])
  .then(function(mlAppName) {
    var createNewPromise = createNew({
      config: {
        mlAppName: mlAppName
      },
      logfile: logfile
    });
    console.log(
      chalk.cyan(
        "\nWhile we are provisioning your app, which might take a while, let's be sure we have all the information we need for the next step."
      )
    );
    var runConfigPromise = runConfig({ logfile: logfile });
    Promise.all([createNewPromise, runConfigPromise])
      .then(function(configs) {
        var config = Object.assign({}, configs[0], configs[1]);
        console.log(chalk.cyan('\nProvisioning your MarkLogic database ...'));
        process.chdir('marklogic');
        childProcess.execSync('./gradlew mlDeploy', {
          stdio: [0, fs.openSync(logfile, 'w'), fs.openSync(logfile, 'w')]
        });

        console.log(chalk.cyan('\nLoading sample data ...'));
        childProcess.execSync('./gradlew loadSampleData', {
          stdio: [0, fs.openSync(logfile, 'w'), fs.openSync(logfile, 'w')]
        });
        process.chdir('..');

        console.log(chalk.cyan('\nRunning your Project'));
        var runningApp = childProcess.spawn('npm', ['start']);
        runningApp.stdout.on('data', function(data) {
          console.log(data.toString());
        });
        runningApp.stderr.on('data', function(data) {
          console.log(data.toString());
        });
        runningApp.on('exit', function(code) {
          console.log(
            chalk.red('Your Project exited with code ' + code.toString())
          );
        });
      })
      .catch(handleError);
  })
  .catch(handleError);
