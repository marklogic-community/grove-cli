#!/usr/bin/env node
var program = require('commander');

program
  .version('0.1.0')
  .command('new <appName>', 'Set up a React / Node application')
  .command('config <environment>', 'Configure an existing React / Node application')
  .command('demo <appName>', 'Set up and run a React / Node demo app')
  .parse(process.argv);
