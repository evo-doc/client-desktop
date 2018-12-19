const log = require('Modules/logger.app.module');

module.exports.CustomError = class CustomError extends Error {
   constructor(hash, code, body, type = 'ERROR', ...params) {
      super(...params);

      if (Error.captureStackTrace) {
         Error.captureStackTrace(this, CustomError);
      }

      this.hash = hash;
      this.code = code;
      this.body = body;
      this.type = type;

      log.error(`[${code}]: ${this.message} (${hash})`);
   }
};
