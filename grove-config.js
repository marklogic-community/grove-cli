require('./src/init');

var program = require('commander');

var runConfig = require('./src/runConfig');

program
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

const config = {
  mlHost: program.mlHost,
  mlRestPort: program.mlRestPort,
  nodePort: program.nodePort,
  environment: program.args[0]
};

runConfig({ config }).then(process.exit);
