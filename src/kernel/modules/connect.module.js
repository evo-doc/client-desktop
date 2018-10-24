const log = require('Modules/logger.app.module');
const logapi = require('Modules/logger.api.module');
const config = require('Configs/server.config.json');
const randomstring = require('randomstring');
const error = require('Modules/error.module');


/**
 * @summary Global errors detection
 * @description Check global erros e.g. invalid token, data consistency etc.
 * @param {string} status - Response status
 * @param {string} body - Bosy of the response
 * @param {string} hash - A hash of the transaction.
 */
function checkGlobal(status, body, hash) {
   log.trace('Connect: Checking global errors');

   // Server unavailable
   if (status >= 500) {
      const e = new error.ResponseError('ERROR', status, hash, 'Server unavailable!', 'Global');
      evodoc.getRouter().redirect('/error/500');
      return e;
   }

   // HTML body
   if (body === 'HTML') {
      const e = new error.ResponseError('ERROR', status, hash, 'Cannot parse JSON!', 'Global');
      evodoc.getRouter().redirect('/error/500');
      return e;
   }

   // New possible token
   if (Object.prototype.hasOwnProperty.call(body, 'token')) {
      evodoc.getAPI()
         .getAuth()
         .saveToken(body.token);
   }

   // 404
   if (status === 404) {
      const e = new error.ResponseError('ERROR', status, hash, 'URL does not exist!', 'Global');
      evodoc.getRouter().redirect('/error/404');
      return e;
   }

   // 401
   if (status === 401) {
      const e = new error.ResponseError('WARN', status, hash, 'Missing or outdated token!', 'Global');
      evodoc.getRouter().redirect('/auth/signin');
      return e;
   }

   return false;
}


// /**
//  * @summary Get all responses from requests
//  * @description Wait for all fetch promises and parse their json responses
//  * @param {Promise} [...arguments] - fetch promises
//  *
//  * @return {Array} An array of JSON responses (in the same order, as arguments)
//  */
// module.exports.waitAJAX = function () {
// return Promise.all([...arguments])
//    .then(responses => Promise.all(responses.map(res => res.json())));
// };


/**
 * @summary GET request
 * @description Prepare and send GET request to the server. Responce should be JSON.
 *
 * @param {string} url - Requested URL without GET params
 * @param {Object} body - Objects of pairs {key: value} which represents GET params
 * @param {Object} [optionsUser={}] - User defined fetch options
 *
 * @return {Promise}
 */
module.exports.getJSON = async (url, body, optionsUser = {}) => {
   // Unique ID
   const hash = randomstring.generate(32);

   // Prepare URL get request
   const euc = encodeURIComponent;
   const getURL = Object.keys(body)
      .map(key => `${euc(key)}=${euc(body[key])}`)
      .join('&');

   // Prepare & merge fetch options
   const optionsDefault = {
      method: 'GET',
      headers: {
         'Content-Type': 'application/json',
         Authorization: `Bearer ${evodoc.getAPI().getToken()}`,
      },
   };
   const options = Object.assign(optionsDefault, optionsUser);
   const requestedURL = `${config.ajax.host}${url}?${getURL}`;


   // Send request
   let response;
   try {
      response = await fetch(requestedURL, options);
   } catch (e) {
      if (e instanceof TypeError && e.message === 'Failed to fetch') {
         evodoc.getRouter().redirect('/error/001');
         throw new error.InternetConnectionError();
      }
   }

   const { status, statusText } = response;
   const json = await response
      .json()
      .then(_ => _)
      .catch(_ => 'HTML' || _);

   logapi(
      hash,
      // Requset
      options.method,
      requestedURL,
      'see URL',
      // Response
      status,
      statusText,
      json,
   );

   // Check global errors
   const isGlobalErrorResult = checkGlobal(status, json, hash);
   if (isGlobalErrorResult !== false) throw isGlobalErrorResult;

   // Success
   return { status, body: json, hash };
};


/**
 * @summary POST request
 * @description Prepare and send POST request to the server. Responce should be JSON.
 *
 * @param {string} url - Requested URL without GET params
 * @param {Object} body - Objects of pairs {key: value} which represents POST params
 * @param {Object} [optionsUser={}] - User defined fetch options
 *
 * @return {(object|error)}
 */
module.exports.postJSON = async (url, body, optionsUser = {}) => {
   log.trace('Connect: postJSON called.');
   // Unique request ID (for logs)
   const hash = randomstring.generate(32);

   const token = evodoc.getAPI().getAuth().getToken();

   // Prepare & merge fetch options
   const optionsDefault = {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
         'Content-Type': 'application/json',
         Authorization: `Bearer ${token}`,
      },
   };


   const options = Object.assign({}, optionsDefault, optionsUser);
   const requestedURL = `${config.host}${url}`;

   // Send request
   let response;
   try {
      response = await fetch(requestedURL, options);
   } catch (e) {
      if (e instanceof TypeError && e.message === 'Failed to fetch') {
         evodoc.getRouter().redirect('/error/001');
         throw new error.InternetConnectionError();
      }
   }


   const { status, statusText } = response;
   const json = await response
      .json()
      .then(_ => _)
      .catch(_ => 'HTML' || _);

   logapi(
      hash,
      // Requset
      options.method,
      requestedURL,
      body,
      // Response
      status,
      statusText,
      json,
   );

   // Check global errors
   const isGlobalErrorResult = checkGlobal(status, json, hash);
   if (isGlobalErrorResult !== false) throw isGlobalErrorResult;

   // Success
   return { status, body: json, hash };
};
