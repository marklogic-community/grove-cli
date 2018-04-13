var prompt = require('./prompt');
var fs = require('fs');
var util = require('util');

var runConfig = function(options) {
  options = options || {};
  var logfile = options.logfile || 'muir-new.log';
  var config = options.config || {};

  return prompt('What host is your instance of MarkLogic running on?', {
    default: 'localhost'
  })
    .then(
      function(mlHost) {
        // TODO: add validation, for example, on valid ports
        // maybe even ping the port for the user
        config.mlHost = mlHost;
        return prompt(
          'What port do you want to use for your MarkLogic REST server?',
          { default: 8063 }
        );
      },
      function(error) {
        throw error;
      }
    )
    .then(
      function(mlRestPort) {
        config.mlRestPort = mlRestPort;
        return prompt(
          'What port do you want to use to run a local Node server for development?',
          { default: 9003 }
        );
      },
      function(error) {
        throw error;
      }
    )
    .then(
      function(nodePort) {
        config.nodePort = nodePort;
        return util
          .promisify(fs.writeFile)(
            'muir-local.json',
            JSON.stringify(config, 0, 2)
          )
          .then(function() {
            return config;
          });
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
      },
      function(error) {
        console.error(error);
        process.exit(1);
      }
    );
};

module.exports = runConfig;
