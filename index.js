#!/usr/bin/env node
const package_json = require('./package.json');
var program = require('commander');

program
  .version(package_json.version)
  .command('new <appName>', 'Set up a React / Node application')
  .command('config', 'Configure an existing React / Node application')
  .command('demo <appName>', 'Set up and run a React / Node demo app')
  .parse(process.argv);
