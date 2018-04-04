#!/usr/bin/env node
var program = require('commander');
var fs = require('fs');
var childProcess = require('child_process');

program.parse(process.argv);

var appName = program.args[0];

var execCallback = function(error, stdout, stderr) {
  console.log('stdout:', stdout);
  console.log('stderr:', stderr);
  if (error !== null) {
    console.log('exec error: ' + error);
  }
};

console.log(
  'Generating a MUIR app named "' +
    appName +
    '" using React and a Node Express.js middle-tier.'
);
childProcess.execSync(
  'git clone --recursive -b MUIR-13-login-logout ssh://git@project.marklogic.com:7999/nacw/muir.git ' +
    appName
);
process.chdir(appName);

console.log('Provisioning your React application and Node middle-tier');
childProcess.execSync('npm install')
console.log('Provisioning your MarkLogic database');
childProcess.execSync('npm run mlDeploy')
console.log('Loading sample data');
childProcess.execSync('npm run loadSampleData');
console.log('Running your application')
childProcess.execSync('npm start');
// childProcess.execSync('npm run setupEverything');
