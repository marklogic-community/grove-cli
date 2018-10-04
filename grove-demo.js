require('./src/init');
var util = require('util');

const program = require('commander');
const childProcess = require('child_process');
const spawn = require('cross-spawn');
const chalk = require('chalk');

var confirmAppName = require('./src/confirmAppName');
var createNew = require('./src/createNew');
var runConfig = require('./src/runConfig');
var utils = require('./src/utils');
const logger = require('./src/utils/logger');

const log = (command, info) => {
  if (!info) return;
  logger.info(`\nstdout for ${command}:\n${info.stdout}`);
  if (info.stderr) {
    logger.error(`\nstderr for ${command}:\n${info.stderr}`);
  }
};

program
  .option('-C, --confirmAppName', 'Confirm appName without interactive prompt')
  .option(
    '-v, --templateVersion <templateVersion>',
    'Use a specific version of the template, if available'
  )
  // TODO template Name
  .option(
    '-H, --mlHost <mlHost>',
    'The host on which your MarkLogic REST server is available'
  )
  .option(
    '-P, --mlRestPort <mlRestPort>',
    'The port on which your MarkLogic REST server is available'
  )
  .option(
    '-p, --nodePort <nodePort>',
    'The port on which your Grove Node server will listen'
  )
  .parse(process.argv);

confirmAppName(program)
  .then(mlAppName => {
    const config = {
      mlAppName,
      templateVersion: program.templateVersion
    };
    return createNew({ config });
  })
  .then(() => {
    const npmInstallPromise = util
      .promisify(childProcess.exec)('npm install')
      .then(output => log('npm install', output));

    console.log(
      chalk.cyan(
        "\nWhile we are provisioning your app, which might take a while, let's be sure we have all the information we need for the next step."
      )
    );
    const config = {
      mlHost: program.mlHost,
      mlRestPort: program.mlRestPort,
      nodePort: program.nodePort
    };
    const runConfigPromise = runConfig({ config });

    return Promise.all([npmInstallPromise, runConfigPromise]);
  })
  .then(() => {
    console.log(chalk.cyan('\nProvisioning your MarkLogic database ...'));
    process.chdir('marklogic');
    return util.promisify(childProcess.exec)(
      utils.gradleExecutable() + ' mlDeploy'
    );
  })
  .then(output => log('mlDeploy', output))
  .then(() => {
    console.log(chalk.cyan('\nLoading sample data ...'));
    return util.promisify(childProcess.exec)(
      utils.gradleExecutable() + ' loadSampleData'
    );
  })
  .then(output => log('loadSampleData', output))
  .then(() => {
    process.chdir('..');

    console.log(
      chalk.cyan(
        '\nRunning your project. See grove-cli.log for logs. Hit <Ctrl-C> to terminate.'
      )
    );
    const runningApp = spawn('npm', ['start']);
    runningApp.stdout.on('data', function(data) {
      logger.info(data.toString());
    });
    runningApp.stderr.on('data', function(data) {
      logger.error(data.toString());
    });
    runningApp.on('exit', function(code) {
      console.log(
        chalk.red('Your Project exited with code ' + code.toString())
      );
      process.exit(1);
    });
  })
  .catch(utils.handleError);
