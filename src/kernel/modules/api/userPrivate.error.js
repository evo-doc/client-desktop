const log = require('Modules/logger.app.module');

module.exports.LimitError = class LimitError extends Error {
   constructor(hash, code, body, ...params) {
      super(...params);

      if (Error.captureStackTrace) {
         Error.captureStackTrace(this, LimitError);
      }

      this.hash = hash;
      this.code = code;
      this.body = body;

      log.error(`[${code}]: ${this.message} (${hash})`);
   }
};
