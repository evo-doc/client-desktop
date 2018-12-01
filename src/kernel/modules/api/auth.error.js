const log = require('Modules/logger.app.module');

module.exports.InvalidAuthDataError = class InvalidAuthDataError extends Error {
   constructor(hash, code, body, ...params) {
      super(...params);

      if (Error.captureStackTrace) {
         Error.captureStackTrace(this, InvalidAuthDataError);
      }

      this.hash = hash;
      this.code = code;
      this.body = body;

      log.warn(`[${code}]: ${this.message} (${hash})`);
   }
};
