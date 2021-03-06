const log = require('Modules/logger.app.module');

/**
 * @summary Global Response Error
 * @description E.g. unauthorised, HTML response, not found
 */
module.exports.ResponseError = class ResponseError extends Error {
   constructor(hash, code = 500, body, type = 'ERROR', ...params) {
      super(...params);

      if (Error.captureStackTrace) {
         Error.captureStackTrace(this, ResponseError);
      }

      this.hash = hash;
      this.code = code;
      this.body = body;
      this.type = type;

      if (type === 'ERROR') {
         log.error(`[${code}]: ${this.message} (${hash})`);
      } else {
         log.warn(`[${code}]: ${this.message} (${hash})`);
      }
   }
};


/**
 * @summary Unexpected Behaviour
 * @description Something went wrong, server respond is too interesting.
 */
module.exports.UnexpectedError = class UnexpectedError extends Error {
   constructor(hash, code, body, ...params) {
      super(...params);

      if (Error.captureStackTrace) {
         Error.captureStackTrace(this, UnexpectedError);
      }

      this.hash = hash;
      this.code = code;
      this.body = body;

      log.error(`[${code}]: ${this.message} (${hash})`);
   }
};


/**
 * @summary Limit is invalid
 * @description limit < 0 OR NaN
 */
module.exports.InvalidLimitError = class InvalidLimitError extends Error {
   constructor(hash, code, body, ...params) {
      super(...params);

      if (Error.captureStackTrace) {
         Error.captureStackTrace(this, InvalidLimitError);
      }

      this.hash = hash;
      this.code = code;
      this.body = body;

      log.error(`[${code}]: ${this.message} (${hash})`);
   }
};

module.exports.PropagationCancel = class PropagationCancel extends Error {
   constructor(...params) {
      super(...params);

      if (Error.captureStackTrace) {
         Error.captureStackTrace(this, PropagationCancel);
      }
   }
};


/**
 * @summary Invalid data
 * @description limit < 0 OR NaN
 */
module.exports.InvalidDataError = class InvalidDataError extends Error {
   constructor(hash, code, body, ...params) {
      super(...params);

      if (Error.captureStackTrace) {
         Error.captureStackTrace(this, InvalidDataError);
      }

      this.hash = hash;
      this.code = code;
      this.body = body;

      log.error(`[${code}]: ${this.message} (${hash})`);
   }
};
