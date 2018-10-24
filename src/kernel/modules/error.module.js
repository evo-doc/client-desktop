const log = require('Modules/logger.app.module');

/**
 * Error - all types of errors (exceptions) that extends Error class.
 * @module Error
 *
 * @example <caption>Create new instances of Errors</caption>
 * new error.LanguageError("Message", 404);
 * new error.PhraseError("Message");
 */

// -------------------------------------------------------------------------------------------------
// Storage
// -------------------------------------------------------------------------------------------------

/**
 * @summary Storage error
 * @description Throw this exception if a storage does not have requested key.
 * @param {string} storage - Storage name
 * @param {string} key - Requested key
 */
module.exports.StorageError = class StorageError extends Error {
   constructor(storage, key) {
      super();
      this.name = this.constructor.name;
      Error.captureStackTrace(this, this.constructor);

      log.warn(`StorageError: file '${storage}' missing '${key}'`);
   }
};


module.exports.InternetConnectionError = class InternetConnectionError extends Error {
   constructor() {
      super();
      this.name = 'Internet Connection Error';
      Error.captureStackTrace(this, this.constructor);
   }
};


module.exports.ResponseError = class ResponseError extends Error {
   constructor(type, status, hash, message, note = '') {
      super();
      this.name = this.constructor.name;
      this.status = status;
      Error.captureStackTrace(this, this.constructor);
      if (type === 'ERROR') {
         log.error(`[${status}] "${hash}": ${message} (${note})`);
      } else {
         log.warn(`[${status}] "${hash}": ${message} (${note})`);
      }
   }
};


module.exports.RenderError = class RenderError extends Error {
   constructor(path) {
      super();
      this.name = this.constructor.name;
      Error.captureStackTrace(this, this.constructor);

      log.warn(`RenderError: ${path}`);
   }
};

module.exports.PageNotFoundError = class PageNotFoundError extends Error {
   constructor(path) {
      super();
      this.name = this.constructor.name;
      Error.captureStackTrace(this, this.constructor);

      log.warn(`PageNotFoundError: ${path}`);
   }
};

module.exports.AuthorizationError = class AuthorizationError extends Error {
   constructor(status = 400, action, message) {
      super();
      this.name = this.constructor.name;
      this.status = status;
      this.message = message;
      Error.captureStackTrace(this, this.constructor);
      log.debug(`[${status}] [${action}]: ${message}`);
   }
};
