require('./src/init');

var program = require('commander');

var runConfig = require('./src/runConfig');

program.parse(process.argv);

runConfig().then(process.exit);
