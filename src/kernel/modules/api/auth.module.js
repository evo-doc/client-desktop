const Storage = require('Modules/storage.module');
const log = require('Modules/logger.app.module');
const connect = require('Modules/connect.module');
const error = require('Modules/error.module');

class Authorization {
   /**
    * @summary Authorization container
    * @description Provides (almost) independent interface for authorization.
    * @class
    *
    * @returns {Authorization} Authorization instance
    */
   constructor() {
      this._storage = null;
   }

   init() {
      // Init storage
      this._storage = new Storage('authorization', {
         token: '',
         username: '',
      });
   }


   async signIn(username, password) {
      // -------------------------------------------------------------------------------------------
      // Developer mode
      // -------------------------------------------------------------------------------------------

      if (username === 'offline' && password === 'offlineTest0') {
         log.debug('[000] OFFLINE TESTING ACTIVE');
         // Received data placeholder
         const resultData = {
            token: '00000000000',
            username: 'TEST MODE',
         };

         // Save data
         this.saveToken(resultData.token);
         this.saveUsername(resultData.username);

         localStorage.setItem('development', 'true');
         evodoc.getRouter().load('/');
         return true;
      }

      // -------------------------------------------------------------------------------------------
      // Regular mode
      // -------------------------------------------------------------------------------------------

      let resultRequest;
      try {
         resultRequest = await connect.postJSON('/auth/signin', {
            login: username,
            password,
         });
      } catch (e) {
         throw e;
      }


      // -----------------------------------------------------------------------
      // Possible results
      // -----------------------------------------------------------------------

      // Response: 200
      if (resultRequest.status === 200) {
         log.info(`[200] User "${username}" was signed in!`);

         // Save data
         const resultData = resultRequest.body;
         this.saveToken(resultData.token);
         this.saveUsername(resultData.username);

         //
         evodoc.getRouter().load('/');
         localStorage.setItem('development', 'false');
         return true;
      }

      // Throw local errors
      if (resultRequest.status === 400) {
         throw new error.AuthorizationError(resultRequest.status, 'SIGN IN', resultRequest.body);
      }


      // -----------------------------------------------------------------------
      // UB
      // -----------------------------------------------------------------------

      const e = new error.ResponseError(
         'ERROR',
         resultRequest.status,
         resultRequest.hash,
         'Unexpected behaviour!',
         'Sign In',
      );

      evodoc.getRequest().redirect('/error/000');
      throw e;
   }


   async signUp(username, email, password) {
      // -------------------------------------------------------------------------------------------
      // Regular mode
      // -------------------------------------------------------------------------------------------

      let resultRequest;
      try {
         resultRequest = await connect.postJSON('/auth/signup', {
            username,
            password,
            email,
         });
      } catch (e) {
         throw e;
      }

      // -----------------------------------------------------------------------
      // Possible results
      // -----------------------------------------------------------------------

      // 200
      if (resultRequest.status === 200) {
         log.info(`[200] User "${username}" was successfully registered!`);
         const resultData = resultRequest.body;
         this.saveToken(resultData.token);
         this.saveUsername(resultData.username);

         evodoc.getRouter().load('/');
         return;
      }

      // 400
      if (resultRequest.status === 400) {
         throw new error.AuthorizationError(resultRequest.status, 'REGISTRATION', resultRequest.body);
      }

      // -----------------------------------------------------------------------
      // UB
      // -----------------------------------------------------------------------

      const e = new error.ResponseError(
         'ERROR',
         resultRequest.status,
         resultRequest.hash,
         'Unexpected behaviour!',
         'Sign Up',
      );
      evodoc.getRequest().redirect('/error/000');
      throw e;
   }


   signOut() {
      log.trace('Auth: Sign out!');
      // Developer
      localStorage.setItem('development', 'false');

      this.removeToken();
      this.removeUsername();
      evodoc.getRouter().redirect('/auth/signin');
   }


   async isAuthenticated() {
      // -------------------------------------------------------------------------------------------
      // Developer mode
      // -------------------------------------------------------------------------------------------

      if (localStorage.getItem('development') === 'true') {
         return true;
      }

      // -------------------------------------------------------------------------------------------
      // Regular mode
      // -------------------------------------------------------------------------------------------

      let resultRequest;
      try {
         resultRequest = await connect.getJSON('/auth/authenticated');
      } catch (e) {
         throw e;
      }

      // -----------------------------------------------------------------------
      // Possible results
      // -----------------------------------------------------------------------

      if (resultRequest.status === 200) {
         log.trace('[200] [IS AUTHORIZED]: Current user is authorized.');
         return true;
      }

      // -----------------------------------------------------------------------
      // UB
      // -----------------------------------------------------------------------

      const e = new error.ResponseError(
         'ERROR',
         resultRequest.status,
         resultRequest.hash,
         'Unexpected behaviour!',
         'is authorized check',
      );
      evodoc.getRequest().redirect('/error/000');
      throw e;
   }


   // ----------------------------------------------------------------------------------------------
   // Private help methods
   // ----------------------------------------------------------------------------------------------

   /**
    * @summary Get user ID from his token
    * @param {string} token - User token
    * @returns {number} Parsed user ID
    */
   _getUserId() {
      return +this.getToken().substr(0, 10) || -1;
   }


   getToken() {
      return this._storage.getData('token');
   }

   saveToken(token) {
      this._storage.setData('token', token);
   }

   removeToken() {
      this._storage.setData('token', 'xxx');
   }


   getUsername() {
      return this._storage.getData('username');
   }

   saveUsername(username) {
      this._storage.setData('username', username);
   }

   removeUsername() {
      this._storage.setData('username', 'xxx');
   }
}

module.exports = Authorization;
