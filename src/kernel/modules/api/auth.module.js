const Storage = require('Modules/storage.module');
const log = require('Modules/logger.app.module');
const connect = require('Modules/connect.module');
const randomstring = require('randomstring');

// Error objects
const errorConnect = require('Modules/connect.error');
const errorAuth = require('Modules/api/auth.error');

// Mock
const ResponseObject = require('Kernel/ResponseObject.class');
const mockData = require('./auth.mock.json');

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


   async signIn(login, password) {
      // -------------------------------------------------------------------------------------------
      // Developer mode
      // -------------------------------------------------------------------------------------------

      if (login === 'offline' && password === 'offlineTest0') {
         log.debug('[000] Offline testing active');
         // Mock response
         const resMockData = mockData.signIn;
         const hash = randomstring.generate(32);

         // Save data
         this.saveToken(resMockData.token);
         this.saveUsername(resMockData.username);
         localStorage.setItem('development', 'true');

         return new ResponseObject(`dev-${hash}`, 200, resMockData);
      }

      // -------------------------------------------------------------------------------------------
      // Production mode
      // -------------------------------------------------------------------------------------------

      let res;
      try {
         res = await connect.postJSON('/auth/signin', {
            login,
            password,
         });
      } catch (globalError) {
         throw globalError;
      }


      // -----------------------------------------------------------------------
      // Possible results
      // -----------------------------------------------------------------------

      // Response: 200
      if (res.code === 200) {
         log.info(`[200] User "${login}" was signed in!`);

         // Save data
         this.saveToken(res.body.token);
         this.saveUsername(res.body.username);

         // Preventive
         localStorage.setItem('development', 'false');
         return true;
      }

      // Throw local errors
      if (res.code === 400) {
         throw new errorAuth.InvalidAuthDataError(
            res.hash, res.code, res.body,
            'Sign In data are invalid',
         );
      }


      // -----------------------------------------------------------------------
      // Unexpected Behaviour
      // -----------------------------------------------------------------------

      throw new errorConnect.UnexpectedError(
         res.hash, res.code, res.body,
         'UB in sign in process',
      );
   }


   async signUp(username, email, password) {
      // -------------------------------------------------------------------------------------------
      // Regular mode
      // -------------------------------------------------------------------------------------------

      let res;
      try {
         res = await connect.postJSON('/auth/signup', {
            username,
            password,
            email,
         });
      } catch (globalError) {
         throw globalError;
      }

      // -----------------------------------------------------------------------
      // Possible results
      // -----------------------------------------------------------------------

      // 200
      if (res.code === 200) {
         log.info(`[200] User "${username}" was successfully registered!`);

         // Global events - save data, etc.
         this.saveToken(res.body.token);
         this.saveUsername(res.body.username);

         return res;
      }

      // 400
      if (res.code === 400) {
         throw new errorAuth.InvalidAuthDataError(
            res.hash, res.code, res.body,
            'Sign Up data are invalid',
         );
      }

      // -----------------------------------------------------------------------
      // Unexpected Behaviour
      // -----------------------------------------------------------------------

      throw new errorConnect.UnexpectedError(
         res.hash, res.code, res.body,
         'UB in sign up process',
      );
   }


   async isAuthenticated() {
      // -------------------------------------------------------------------------------------------
      // Developer mode
      // -------------------------------------------------------------------------------------------

      if (localStorage.getItem('development') === 'true') {
         const hash = randomstring.generate(32);
         const resMockData = mockData.authenticated;
         return new ResponseObject(`dev-${hash}`, 200, resMockData);
      }

      // -------------------------------------------------------------------------------------------
      // Regular mode
      // -------------------------------------------------------------------------------------------

      let res;
      try {
         res = await connect.getJSON('/auth/authenticated');
      } catch (globalError) {
         throw globalError;
      }

      // -----------------------------------------------------------------------
      // Possible results
      // -----------------------------------------------------------------------

      if (res.code === 200) {
         log.trace('[200] : Current user is authorized.');
         return res;
      }

      // -----------------------------------------------------------------------
      // Unexpected Behaviour
      // -----------------------------------------------------------------------

      throw new errorConnect.UnexpectedError(
         res.hash, res.code, res.body,
         'UB in sign up process',
      );
   }


   signOut() {
      log.trace('Auth: Sign out!');
      // Developer
      localStorage.setItem('development', 'false');

      this.removeToken();
      this.removeUsername();
      evodoc.getRouter().redirect('/auth/signin');
   }


   // ----------------------------------------------------------------------------------------------
   // Helpers
   // ----------------------------------------------------------------------------------------------

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
