var prompt = require('./prompt');

var confirmAppName = function(mlAppName) {
  mlAppName = mlAppName || 'grove-app';
  return prompt('Please confirm the name of your new project:', {
    default: mlAppName
  });
};

module.exports = confirmAppName;
