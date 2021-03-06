const Storage = require('Modules/storage.module');
const log = require('Modules/logger.app.module');
const connect = require('Modules/connect.module');
const randomstring = require('randomstring');

// Error objects
const errorConnect = require('Modules/connect.error');
const errorUserPrivate = require('Modules/api/userPrivate.error');

// Mock
const ResponseObject = require('Kernel/ResponseObject.class');
const mockData = require('Modules/api/userPrivate.mock.json');


class UserPrivate {
   constructor() {
      this._storage = null;
   }

   init() {
      // New Optional Storage
      this._storage = new Storage('custom', {
         item: '',
      });
   }


   async getOwnAccount() {
      // -------------------------------------------------------------------------------------------
      // Developer mode
      // -------------------------------------------------------------------------------------------

      if (localStorage.getItem('development') === 'true') {
         // Mock response
         const resMockData = mockData.getOwnAccount;
         const hash = randomstring.generate(32);
         return new ResponseObject(`dev-${hash}`, 200, resMockData);
      }


      // -------------------------------------------------------------------------------------------
      // Production mode
      // -------------------------------------------------------------------------------------------

      let res;
      try {
         res = await connect.getJSON('/user/account');
      } catch (globalError) {
         throw globalError;
      }


      // -----------------------------------------------------------------------
      // Response codes
      // -----------------------------------------------------------------------

      // Success
      if (res.code === 200) {
         log.info('[200] Event description');
         return res;
      }

      // -----------------------------------------------------------------------
      // Unexpected Behaviour
      // -----------------------------------------------------------------------

      throw new errorConnect.UnexpectedError(
         res.hash, res.code, res.body,
         'UB in getOwnAccount process',
      );
   }


   async editOwnAccount(data) {
      // -------------------------------------------------------------------------------------------
      // Production mode
      // -------------------------------------------------------------------------------------------
      let res;
      try {
         res = await connect.patchJSON('/user/account', data);
      } catch (globalError) {
         throw globalError;
      }


      // -----------------------------------------------------------------------
      // Response codes
      // -----------------------------------------------------------------------
      // Success
      if (res.code === 200) {
         log.info('[200] User account patch done');
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
         'UB in account patching process',
      );
   }


   async deleteOwnAccount() {
      // -------------------------------------------------------------------------------------------
      // Production mode
      // -------------------------------------------------------------------------------------------
      let res;
      try {
         res = await connect.deleteJSON('/user/account');
      } catch (globalError) {
         throw globalError;
      }

      // -----------------------------------------------------------------------
      // Response codes
      // -----------------------------------------------------------------------
      // Success
      if (res.code === 200) {
         log.info('[200] Account deleted');
         return res;
      }

      // -----------------------------------------------------------------------
      // Unexpected Behaviour
      // -----------------------------------------------------------------------
      throw new errorConnect.UnexpectedError(
         res.hash, res.code, res.body,
         'UB in account deleting process',
      );
   }


   async changePassword(oldPass, newPass) {
      // -------------------------------------------------------------------------------------------
      // Production mode
      // -------------------------------------------------------------------------------------------
      let res;
      try {
         res = await connect.patchJSON('/user/account/password', {
            old_password: oldPass,
            new_password: newPass,
         });
      } catch (globalError) {
         throw globalError;
      }


      // -----------------------------------------------------------------------
      // Response codes
      // -----------------------------------------------------------------------
      // Success
      if (res.code === 200) {
         log.info('[200] Password changed');
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
         'UB in sign in process',
      );
   }


   async getAccessibleProjects(limit = 0) {
      // -------------------------------------------------------------------------------------------
      // Developer mode
      // -------------------------------------------------------------------------------------------

      if (localStorage.getItem('development') === 'true') {
         // Mock response
         const resMockData = mockData.getAccessibleProjects;
         const hash = randomstring.generate(32);
         return new ResponseObject(`dev-${hash}`, 200, resMockData);
      }


      // -------------------------------------------------------------------------------------------
      // Production mode
      // -------------------------------------------------------------------------------------------

      let res;
      try {
         res = await connect.postJSON('/user/projects', {
            limit,
         });
      } catch (globalError) {
         throw globalError;
      }


      // -----------------------------------------------------------------------
      // Response codes
      // -----------------------------------------------------------------------

      // Success
      if (res.code === 200) {
         log.info('[200] Get user projects');
         return res;
      }

      // Failure
      if (res.code === 400) {
         throw new errorUserPrivate.LimitError(
            res.hash, res.code, res.body,
            'Limit should be 0<=x',
         );
      }

      // -----------------------------------------------------------------------
      // Unexpected Behaviour
      // -----------------------------------------------------------------------

      throw new errorConnect.UnexpectedError(
         res.hash, res.code, res.body,
         'UB in getOwnAccount process',
      );
   }


   // ----------------------------------------------------------------------------------------------
   // Helpers
   // ----------------------------------------------------------------------------------------------
}

module.exports = UserPrivate;
