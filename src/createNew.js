var fs = require('fs');
var util = require('util');
var childProcess = require('child_process');
var prompt = require('./prompt');

var createNew = function(mlAppName, logfile) {
  logfile = logfile || 'muir-new.log';
  config = {
    mlAppName: mlAppName
  };

  // TODO: confirm mlAppName
  console.log(
    '\nGenerating a MUIR application named "' +
      mlAppName +
      '" using React and a Node Express.js middle-tier.'
  );

  childProcess.execSync(
    'git clone --recursive ssh://git@project.marklogic.com:7999/nacw/muir.git ' +
      mlAppName
  );
  process.chdir(mlAppName);

  console.log('Provisioning your React application and Node middle-tier');
  var execCallback = function(error, stdout, stderr) {
    if (error) throw error;
    fs.appendFile(logfile, '\nlogging stdout:\n' + stdout, function(error) {
      if (error) throw error;
    });
    fs.appendFile(logfile, '\nlogging stderr:\n' + stderr, function(error) {
      if (error) throw error;
    });
  };
  childProcess.exec('npm install', execCallback);

  console.log(
    "\nWhile we are provisioning your app, let's be sure we have all the information we need for the next step."
  );
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
    .then(function(mlPort) {
      config.mlPort = mlPort;
      return prompt(
        'What port do you want to use to run a local Node server for development?',
        { default: 9003 }
      );
    }).then(function(nodePort) {
      config.nodePort = nodePort;
      return util.promisify(
        fs.writeFile
      )('muir-local.json', JSON.stringify(config, 0, 2));
      // return prompt(
      //   'Please provide the username of a MarkLogic admin user, used for configuring the database',
      //   { default: 'admin' }
      // );
      // })
      // .then(function(userAdminUser) {
      // adminUser = userAdminUser;
      // console.log('adminUser:', adminUser);
      // // TODO: allow blank for this prompt
      // return prompt(
      //   'Please provide the password of that MarkLogic admin user',
      //   {
      //     default: 'admin'
      //   }
      // );
      // })
      // .then(function(userAdminPassword) {
      // adminPassword = userAdminPassword;
      // console.log('adminPassword:', adminPassword);
    });
};

module.exports = createNew;
