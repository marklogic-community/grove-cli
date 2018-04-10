#!/usr/bin/env node
var program = require('commander');
var fs = require('fs');
var childProcess = require('child_process');
var createNew = require('./src/createNew');

var logfile = 'muir-demo.log';

program.parse(process.argv);
var appName = program.args[0];

// TODO: get logging working
createNew(appName, logfile).then(function() {
  console.log('\nProvisioning your MarkLogic database');
  childProcess.execSync('npm run mlDeploy', {
    stdio: [0, fs.openSync(logfile, 'w'), fs.openSync(logfile, 'w')]
  });

  console.log('\nLoading sample data');
  childProcess.execSync('npm run loadSampleData', {
    stdio: [0, fs.openSync(logfile, 'w'), fs.openSync(logfile, 'w')]
  });

  console.log('\nRunning your application');
  var runningApp = childProcess.spawn('npm', ['start']);
  runningApp.stdout.on('data', function(data) {
    console.log(data.toString());
  });
  runningApp.stderr.on('data', function(data) {
    console.log(data.toString());
  });
  runningApp.on('exit', function(code) {
    console.log('Your application exited with code ' + code.toString());
  });
});
