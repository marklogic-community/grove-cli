#!/usr/bin/env node
var program = require('commander');
var createNew = require('./src/createNew');

program.parse(process.argv);
var appName = program.args[0];

createNew(appName).then(
  function() {
    process.exit();
  },
  function(error) {
    throw error;
  }
);
