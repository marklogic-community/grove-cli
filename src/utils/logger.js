const winston = require('winston');

const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(
      info =>
        `\n${info.timestamp} ${info.level}: ${info.message}\n${
          info.stack ? info.stack : ''
        }`
    )
  ),
  transports: [
    new winston.transports.Console({
      level: 'warn',
      handleExceptions: true
    }),
    new winston.transports.File({
      level: 'info',
      filename: 'grove-cli.log',
      handleExceptions: true
    })
  ]
});

module.exports = logger;
