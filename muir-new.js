#!/usr/bin/env node
require('./src/init');

var program = require('commander');

var confirmAppName = require('./src/confirmAppName');
var createNew = require('./src/createNew');

program.parse(process.argv);
var mlAppName = program.args[0];

confirmAppName(program.args[0]).then(
  function(mlAppName) {
    createNew({ config: { mlAppName: mlAppName } }).then(
      function(config) {
        console.log(
          '\nCongratulations, you successfully generated a new MUIR application.'
        );

        console.log(
          '\nNote that you need to have MarkLogic installed and configured with users, a database, and an AppServer running on the port expected by this application (which, again, you can configure using `muir config`). For your convenience, we have placed an ml-gradle project in the /marklogic directory of this generated application that can be used for MarkLogic automation tasks, if desired. It includes an out-of-the-box configuration matching MUIR default settings. You will need to change settings in ml-gradle to match changes you make to your MUIR app configuration.'
        );
        console.log(
          '\nSee https://github.com/marklogic-community/ml-gradle for more information about ml-gradle and the powerful assistance it can provide in automating MarkLogic.'
        );

        console.log('\nYou can now start your application if you wish:');
        console.log('\n    cd ' + config.mlAppName);
        console.log('    npm start');

        console.log(
          '\nYou may need to configure some application settings, such as hosts and port, first. You can do this using the `muir config` command:'
        );
        console.log('\n    cd ' + config.mlAppName);
        console.log('    muir config');

        process.exit();
      },
      function(error) {
        throw error;
      }
    );
  },
  function(error) {
    throw error;
  }
);
