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
