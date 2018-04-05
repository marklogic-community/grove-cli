var prompt = function(question, options, callback) {
  return new Promise(function(resolve, reject) {
    process.stdin.resume();
    process.stdout.write('\n' + question);
    if (options.default) {
      process.stdout.write(' (Default: ' + options.default + '): ')
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
