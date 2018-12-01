/**
 * @summary Response class for parsed server responses
 * @description Used as a default structure to pass responses into parent callers.
 * @param {string} hash - Unique request hash (debugging)
 * @param {string} code - Response code
 * @param {object} body - Parsed JSON body
 */
class ResponseObject {
   constructor(hash, code, body) {
      this.hash = hash;
      this.code = code;
      this.body = body;
   }

   isSuccess() {
      return this.code >= 200 && this.code <= 299;
   }

   isFailure() {
      return this.code >= 300;
   }
}

module.exports = ResponseObject;
