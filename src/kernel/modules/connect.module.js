const log = require('Modules/logger.app.module');
const logapi = require('Modules/logger.api.module');
const config = require('Configs/server.config.json');
const randomstring = require('randomstring');

const errorConnect = require('Modules/connect.error');
const ResponseObject = require('Kernel/ResponseObject.class');


/**
 * @summary Global errors detection
 * @description Check global erros e.g. invalid token, data consistency etc.
 * @param {string} code - Response status
 * @param {string} body - Bosy of the response
 * @param {string} hash - A hash of the transaction.
 */
function checkGlobalError(hash, code, body) {
   log.trace('Connect: Checking global errors');

   // Server unavailable
   if (code >= 500) {
      return new errorConnect.ResponseError(
         hash, code, body,
         'ERROR', 'Server unavailable!',
      );
   }

   // HTML body
   if (body === 'HTML') {
      return new errorConnect.ResponseError(
         hash, 500, body,
         'ERROR', 'Cannot parse JSON!',
      );
   }

   // Detect new possible token
   if (Object.prototype.hasOwnProperty.call(body, 'token')) {
      evodoc.getAPI()
         .getAuth()
         .saveToken(body.token);
   }

   // 404
   if (code === 404) {
      return new errorConnect.ResponseError(
         hash, code, body,
         'ERROR', 'URL does not exist!',
      );
   }

   // 401
   if (code === 401) {
      return new errorConnect.ResponseError(
         hash, code, body,
         'WARN', 'Missing or outdated token!',
      );
   }

   // 422
   if (code === 422) {
      return new errorConnect.ResponseError(
         hash, code, body,
         'ERROR', 'User request is missing some data.',
      );
   }

   return false;
}


/**
 * @summary GET request
 * @description Prepare and send GET request to the server. Responce should be JSON.
 *
 * @param {string} reqPath - Requested URL without GET params
 * @param {Object} reqBody - Objects of pairs {key: value} which represents GET params
 * @param {Object} [reqOptionsUser={}] - User defined fetch options
 *
 * @return {Promise}
 */
module.exports.getJSON = async (reqPath, reqBody = {}, reqOptionsUser = {}) => {
   // Unique ID
   const hash = randomstring.generate(32);

   // Prepare URL get request
   const euc = encodeURIComponent;
   const getURL = Object.keys(reqBody)
      .map(key => `${euc(key)}=${euc(reqBody[key])}`)
      .join('&');

   // Prepare & merge fetch options
   const reqOptionsDefault = {
      method: 'GET',
      credentials: 'include',
      headers: {
         'Content-Type': 'application/json',
         Authorization: `Bearer ${evodoc.getAPI().getAuth().getToken()}`,
      },
   };
   const reqOptions = Object.assign({}, reqOptionsDefault, reqOptionsUser);
   const reqURL = `${config.host}${reqPath}?${getURL}`;


   // Send request
   let response;
   try {
      response = await fetch(reqURL, reqOptions);
   } catch (e) {
      if (e instanceof TypeError && e.message === 'Failed to fetch') {
         throw new errorConnect.ResponseError(
            hash, 1000, {},
            'WARN', 'No internet connection.',
         );
      }
   }

   const { status, statusText } = response;
   const body = await response
      .json()
      .then(_ => _)
      .catch(() => 'HTML');

   logapi(
      hash,
      // Requset
      reqOptions.method, reqURL, 'see URL',
      // Response
      status, statusText, body,
   );

   // Check global errors
   const isGlobalErrorResult = checkGlobalError(hash, status, body);
   if (isGlobalErrorResult !== false) throw isGlobalErrorResult;

   // Success
   return new ResponseObject(hash, status, body);
};


/**
 * @summary POST request
 * @description Prepare and send POST request to the server. Responce should be JSON.
 *
 * @param {string} reqPath - Requested URL without GET params
 * @param {Object} reqBody - Objects of pairs {key: value} which represents POST params
 * @param {Object} [reqOptionsUser={}] - User defined fetch options
 *
 * @return {(object|error)}
 */
module.exports.postJSON = async (reqPath, reqBody = {}, reqOptionsUser = {}) => {
   log.trace('Connect: postJSON called.');
   // Unique request ID (for logs)
   const hash = randomstring.generate(32);
   const token = evodoc.getAPI().getAuth().getToken();

   // Prepare & merge fetch options
   const reqOptionsDefault = {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify(reqBody),
      headers: {
         'Content-Type': 'application/json',
         Authorization: `Bearer ${token}`,
      },
   };
   const reqOptions = Object.assign({}, reqOptionsDefault, reqOptionsUser);
   const reqURL = `${config.host}${reqPath}`;

   // Send request
   let response;
   try {
      response = await fetch(reqURL, reqOptions);
   } catch (e) {
      if (e instanceof TypeError && e.message === 'Failed to fetch') {
         throw new errorConnect.ResponseError(
            hash, 1000, {},
            'WARN', 'No internet connection.',
         );
      }
   }

   const { status, statusText } = response;
   const body = await response
      .json()
      .then(_ => _)
      .catch(() => 'HTML');

   // Security fix :)
   let reqBodyPrivate = reqBody;
   if (
      reqPath.indexOf('auth/') === 1
      || reqPath.indexOf('/user/account/password') === 1
   ) {
      reqBodyPrivate = { key: 'Request body data are hidden due to privacy.' };
   }

   logapi(
      hash,
      // Requset
      reqOptions.method, reqURL, reqBodyPrivate,
      // Response
      status, statusText, body,
   );

   // Check global errors
   const isGlobalErrorResult = checkGlobalError(hash, status, body);
   if (isGlobalErrorResult !== false) throw isGlobalErrorResult;

   // Success
   return new ResponseObject(hash, status, body);
};


module.exports.patchJSON = async (reqPath, reqBody = {}, reqOptionsUser = {}) => {
   const reqOptionsPatch = {
      method: 'PATCH',
   };
   const reqOptionsUserPatch = Object.assign({}, reqOptionsUser, reqOptionsPatch);
   return this.postJSON(reqPath, reqBody, reqOptionsUserPatch);
};


module.exports.deleteJSON = async (reqPath, reqBody = {}, reqOptionsUser = {}) => {
   const reqOptionsDelete = {
      method: 'DELETE',
   };
   const reqOptionsUserDelete = Object.assign({}, reqOptionsUser, reqOptionsDelete);
   return this.postJSON(reqPath, reqBody, reqOptionsUserDelete);
};


module.exports.ajaxRequest = async (ajaxFunction, catchFunction) => {
   try {
      // Try to do all requests
      await ajaxFunction();
   } catch (err) {
      try {
         // Some requests have exceptions
         catchFunction(err);
      } catch (e) {
         // The error was NOT resolved in catchFunction
         // Need to check global errors

         if (err instanceof errorConnect.ResponseError) {
            evodoc.getRouter().load(`/error/${err.code}`);
            throw new errorConnect.PropagationCancel();
         }

         if (err instanceof errorConnect.UnexpectedError) {
            evodoc.getRouter().load('/error/666');
            throw new errorConnect.PropagationCancel();
         }

         // Promise rejected
         log.error('Impossible error');
         evodoc.getRouter().load('/error/999');
         throw new errorConnect.PropagationCancel();
      }
   }
};
