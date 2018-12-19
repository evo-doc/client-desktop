const log = require('Modules/logger.app.module');
const connect = require('Modules/connect.module');
const randomstring = require('randomstring');

// Error objects
const errorConnect = require('Modules/connect.error');

// Mock
const ResponseObject = require('Kernel/ResponseObject.class');
const mockData = require('Modules/api/_template.mock.json');


class Custom {
   constructor() {
      this._storage = null;
   }

   init() {}


   async getAllUsers() {
      // -------------------------------------------------------------------------------------------
      // Developer mode
      // -------------------------------------------------------------------------------------------
      if (localStorage.getItem('development') === 'true') {
         // Mock response
         const resMockData = mockData.getAllUsers;
         const hash = randomstring.generate(32);
         return new ResponseObject(`dev-${hash}`, 200, resMockData);
      }

      // -------------------------------------------------------------------------------------------
      // Production mode
      // -------------------------------------------------------------------------------------------
      let res;
      try {
         res = await connect.getJSON('/users');
      } catch (globalError) {
         throw globalError;
      }

      // -----------------------------------------------------------------------
      // Response codes
      // -----------------------------------------------------------------------
      // Success
      if (res.code === 200) {
         log.info('[200] Get usernames');
         return res;
      }

      // -----------------------------------------------------------------------
      // Unexpected Behaviour
      // -----------------------------------------------------------------------

      throw new errorConnect.UnexpectedError(
         res.hash, res.code, res.body,
         'UB in getAllUsers process',
      );
   }


   async getUserAccount(username) {
      // -------------------------------------------------------------------------------------------
      // Developer mode
      // -------------------------------------------------------------------------------------------
      if (localStorage.getItem('development') === 'true') {
         // Mock response
         const resMockData = mockData.getUserAccount;
         const hash = randomstring.generate(32);
         return new ResponseObject(`dev-${hash}`, 200, resMockData);
      }

      // -------------------------------------------------------------------------------------------
      // Production mode
      // -------------------------------------------------------------------------------------------
      let res;
      try {
         res = await connect.getJSON(`/users/${username}/account`);
      } catch (globalError) {
         throw globalError;
      }


      // -----------------------------------------------------------------------
      // Response codes
      // -----------------------------------------------------------------------

      // Success
      if (res.code === 200) {
         log.info('[200] Get user account data');
         return res;
      }

      // Failures
      if (res.code === 400) {
         throw new errorConnect.InvalidDataError(
            res.hash, res.code, res.body,
            'Some data are invalid',
         );
      }


      // -----------------------------------------------------------------------
      // Unexpected Behaviour
      // -----------------------------------------------------------------------

      throw new errorConnect.UnexpectedError(
         res.hash, res.code, res.body,
         'UB in getUserAccount process',
      );
   }


   // ----------------------------------------------------------------------------------------------
   // Helpers
   // ----------------------------------------------------------------------------------------------
}

module.exports = Custom;
