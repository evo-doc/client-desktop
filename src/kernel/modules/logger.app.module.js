const winston = require('winston');
const electron = require('electron');
require('winston-daily-rotate-file');

const level = process.env.NODE_ENV === 'production' ? 'info' : 'debug';

const levels = {
   error: 0,
   warn: 1,
   info: 2,
   trace: 3,
   debug: 4,
};

const transport = new winston.transports.DailyRotateFile({
   // ROTATION
   filename: 'log.application.%DATE%',
   dirname: process.env.NODE_ENV === 'production'
      ? (electron.app || electron.remote.app).getPath('userData')
      : './logs/',
   datePattern: 'YYYY-MM-DD-HH',
   zippedArchive: false,
   maxSize: '20m',
   maxFiles: '2d',
   level: 'debug',
});

const logger = winston.createLogger({
   // WINSTON
   level,
   levels,
   format: winston.format.json(),
   transports: [transport],
});

if (process.env.NODE_ENV !== 'production') {
   logger.add(
      new winston.transports.Console({
         format: winston.format.simple(),
      }),
   );
}

module.exports = logger;
