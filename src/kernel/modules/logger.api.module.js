const winston = require('winston');
const electron = require('electron');
require('winston-daily-rotate-file');

const levels = {
   debug: 0,
};

const transport = new winston.transports.DailyRotateFile({
   // ROTATION
   filename: 'log.api.%DATE%',
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
   level: 'debug',
   levels,
   format: winston.format.json(),
   transports: [],
});

if (process.env.NODE_ENV !== 'production') {
   logger.add(transport);

   logger.add(
      new winston.transports.Console({
         format: winston.format.simple(),
      }),
   );
}


module.exports = (
   hash,
   // Request
   reqMethod,
   reqUrl,
   reqBody,
   // Response
   resStatus,
   resStatusText,
   resBody,
) => {
   let msg = `[DEBUG] ${hash}\n`;
   msg += 'REQUEST\n';
   msg += `\tMethod: [${reqMethod}] ${reqUrl}\n`;
   msg += `\tBody:\n${JSON.stringify(reqBody, null, '\t')}\n\n`;
   msg += 'RESPONSE\n';
   msg += `\tStatus: ${resStatus} (${resStatusText})\n`;
   msg += `\tBody:\n${JSON.stringify(resBody, null, '\t')}\n\n`;

   logger.debug(msg);
};
