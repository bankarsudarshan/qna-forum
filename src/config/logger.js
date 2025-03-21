const fs = require('fs');
const winston = require('winston');

const logDir = 'logs';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: `${logDir}/error.log`, level: 'error' }) // Ensure logs folder exists
  ],
});

module.exports = logger;
