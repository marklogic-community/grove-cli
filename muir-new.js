#!/usr/bin/env node
require('./src/init');

const program = require('commander');
const chalk = require('chalk');

const confirmAppName = require('./src/confirmAppName');
const createNew = require('./src/createNew');
const utils = require('./src/utils');

program.parse(process.argv);
const mlAppName = program.args[0];

confirmAppName(program.args[0])
  .then(function(mlAppName) {
    return createNew({ config: { mlAppName: mlAppName } });
  })
  .then(function(config) {
    console.log(
      chalk.blue(
        '\nCongratulations, you successfully generated a new MUIR application.'
      )
    );

    console.log(
      chalk.blue(
        '\nYou can now start your application if you wish, though you will not be able to login unless you have also created a MarkLogic REST server on the default host and port (see below for details on using ml-gradle to do that).'
      )
    );
    console.log('\n    cd ' + config.mlAppName);
    console.log('    npm install');
    console.log('    npm start');

    console.log(
      '\nYou may need to configure some application settings, such as hosts and port, first. You can do this using the `muir config` command:'
    );
    console.log('\n    muir config');

    console.log(
      '\nYou can invoke ml-gradle to deploy the configuration found in the `/marklogic` directory to MarkLogic by running:'
    );
    console.log('\n    cd marklogic');
    console.log('    ' + utils.gradleExecutable() + ' mlDeploy');
    console.log('    cd ..');
    console.log(
      '\nOther ml-gradle tasks can be run from inside the `/marklogic` directory, as described in the ml-gradle documentation:'
    );
    console.log('https://github.com/marklogic-community/ml-gradle');

    console.log('\n');

    process.exit();
  })
  .catch(utils.handleError);
