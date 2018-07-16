var chalk = require('chalk');

var prompt = function(question, options) {
  return new Promise(function(resolve) {
    process.stdin.resume();
    process.stdout.write('\n' + chalk.green(question));
    if (options.default) {
      process.stdout.write(
        chalk.red(' (' + 'Default: ' + options.default + '): ')
      );
    }

    process.stdin.once('data', function(data) {
      var response = data.toString().trim();
      if (response === '' && options.default) {
        response = options.default;
      }
      // TODO: handle errors
      resolve(response);
    });
  });
};

module.exports = prompt;
