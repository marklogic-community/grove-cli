require('./src/init');

const program = require('commander');
const chalk = require('chalk');

const confirmAppName = require('./src/confirmAppName');
const createNew = require('./src/createNew');
const utils = require('./src/utils');

program
  .option('-C, --confirmAppName', 'Confirm appName without interactive prompt')
  .option(
    '-n, --templateName <templateName>',
    'Specify a templateName. Current choices: React, Vue'
  )
  .option(
    '-v, --templateVersion <templateVersion>',
    'Use a specific version of the template, if available'
  )
  .parse(process.argv);

confirmAppName(program)
  .then(mlAppName => {
    const config = {
      mlAppName,
      templateName: program.templateName,
      templateVersion: program.templateVersion
    };
    return createNew({ config });
  })
  .then(function(config) {
    console.log(
      chalk.green(
        '\nCongratulations, you successfully generated a new Grove project.'
      )
    );

    console.log(chalk.cyan('\nNow you can view your new Grove Project:'));
    console.log('\n    cd ' + config.mlAppName);

    console.log(
      chalk.cyan(
        '\nYou may need to configure some application settings, such as hosts and port. You can do this using the `grove config` command:'
      )
    );
    console.log('\n    grove config');

    console.log(
      chalk.cyan(
        '\nYou might already have a MarkLogic database, user, and REST server that you your Grove project will run against. Otherwise, you can invoke ml-gradle to deploy the configuration found in the `/marklogic` directory to MarkLogic by running:'
      )
    );
    console.log('\n    cd marklogic');
    console.log('    ' + utils.gradleExecutable() + ' mlDeploy');
    console.log('    cd ..');
    console.log(
      '\nOther ml-gradle tasks can be run from inside the `/marklogic` directory, as described in the ml-gradle documentation:'
    );
    console.log('https://github.com/marklogic-community/ml-gradle');

    console.log(
      chalk.cyan(
        '\nRun the following to install javascript dependencies using the npm package manager:'
      )
    );
    console.log('\n    npm install');

    console.log(
      chalk.cyan(
        '\nYou can also start your application if you wish, though you will also need a MarkLogic REST server running on the configured host and port (see above for details on using ml-gradle to create MarkLogic resources).'
      )
    );
    console.log('\n    npm start');

    console.log(
      chalk.cyan(
        '\nYou can log into your application using any MarkLogic user with sufficient permissions.\n'
      )
    );

    process.exit();
  })
  .catch(utils.handleError);
