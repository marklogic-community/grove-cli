var fs = require('fs');
var childProcess = require('child_process');
var prompt = require('./prompt');

var createNew = function(appName, logfile) {
  // TODO: confirm appName
  logfile = logfile || 'muir-new.log';

  var execCallback = function(error, stdout, stderr) {
    if (error) {
      console.error('error: ' + error);
      return;
    }
    fs.appendFileSync(logfile, '\nstdout:\n' + stdout);
    fs.appendFileSync(logfile, '\nstderr:\n' + stderr);
  };

  console.log(
    '\nGenerating a MUIR application named "' +
      appName +
      '" using React and a Node Express.js middle-tier.'
  );

  childProcess.execSync(
    'git clone --recursive -b MUIR-13-login-logout ssh://git@project.marklogic.com:7999/nacw/muir.git ' +
      appName
  );
  process.chdir(appName);

  console.log('Provisioning your React application and Node middle-tier');
  childProcess.exec('npm install', execCallback);

  console.log(
    "\nWhile we are provisioning your app, let's be sure we have all the information we need for the next step."
  );
  return prompt('What host is your instance of MarkLogic running on?', {
    default: 'localhost'
  })
    .then(function(userMLHost) {
      mlHost = userMLHost;
      console.log('mlHost:', mlHost);
      // TODO: add validation, for example, on valid ports
      // maybe even ping the port for the user
      return prompt(
        'What port do you want to use for your MarkLogic REST server?',
        { default: 8063 }
      );
    })
    .then(function(userMLPort) {
      mlPort = userMLPort;
      console.log('mlPort:', mlPort);
      return prompt(
        'Please provide the username of a MarkLogic admin user, used for configuring the database',
        { default: 'admin' }
      );
    })
    .then(function(userAdminUser) {
      adminUser = userAdminUser;
      console.log('adminUser:', adminUser);
      // TODO: allow blank for this prompt
      return prompt(
        'Please provide the password of that MarkLogic admin user',
        {
          default: 'admin'
        }
      );
    })
    .then(function(userAdminPassword) {
      adminPassword = userAdminPassword;
      console.log('adminPassword:', adminPassword);
    });
};

module.exports = createNew;
