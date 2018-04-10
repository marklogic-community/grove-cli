#!/usr/bin/env node
var program = require('commander');

program
  .version('0.0.1')
  .command('new <appName>', 'Set up a React / Node application')
  .command('demo <appName>', 'Set up and run a React / Node demo app')
  .parse(process.argv);
