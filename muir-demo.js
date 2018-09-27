require('./src/init');
var util = require('util');

const program = require('commander');
const fs = require('fs');
const childProcess = require('child_process');
const spawn = require('cross-spawn');
const chalk = require('chalk');

var confirmAppName = require('./src/confirmAppName');
var createNew = require('./src/createNew');
var runConfig = require('./src/runConfig');
var utils = require('./src/utils');

// TODO: move logs into logs/
var logfile = 'muir-demo.log';

program
  .option(
    '-D, --development',
    'Use bleeding-edge development version, if available'
  )
  .parse(process.argv);

confirmAppName(program.args[0])
  .then(function(mlAppName) {
    let config = { mlAppName };
    if (program.development) {
      console.warn(
        chalk.red(
          '\nWARNING: Using the bleeding edge version to create your demo.'
        )
      );
      config.development = program.development;
    }
    var createNewPromise = createNew({ config, logfile }).then(() => {
      return util
        .promisify(childProcess.exec)('npm install')
        .then(function(stdout, stderr) {
          fs.appendFile(
            logfile,
            '\nlogging stdout:\n' + JSON.stringify(stdout),
            function(error) {
              if (error) throw error;
            }
          );
          fs.appendFile(logfile, '\nlogging stderr:\n' + stderr, function(
            error
          ) {
            if (error) throw error;
          });
        });
    });
    console.log(
      chalk.cyan(
        "\nWhile we are provisioning your app, which might take a while, let's be sure we have all the information we need for the next step."
      )
    );
    var runConfigPromise = runConfig({ logfile: logfile });
    Promise.all([createNewPromise, runConfigPromise])
      .then(function() {
        console.log(chalk.cyan('\nProvisioning your MarkLogic database ...'));
        process.chdir('marklogic');
        childProcess.execSync(utils.gradleExecutable() + ' mlDeploy', {
          stdio: [0, fs.openSync(logfile, 'w'), fs.openSync(logfile, 'w')]
        });

        console.log(chalk.cyan('\nLoading sample data ...'));
        childProcess.execSync(utils.gradleExecutable() + ' loadSampleData', {
          stdio: [0, fs.openSync(logfile, 'w'), fs.openSync(logfile, 'w')]
        });
        process.chdir('..');

        console.log(chalk.cyan('\nRunning your Project'));
        const runningApp = spawn('npm', ['start']);
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
      .catch(utils.handleError);
  })
  .catch(utils.handleError);
