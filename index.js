#!/usr/bin/env node
var program = require('commander');

program
  .version('0.0.1')
  .command('generate <appName>', 'Generate a React / Node MUIR app')
  .parse(process.argv);
