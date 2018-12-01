const Storage = require('Modules/storage.module');
const log = require('Modules/logger.app.module');
const connect = require('Modules/connect.module');
const randomstring = require('randomstring');

// Error objects
const errorConnect = require('Modules/connect.error');
const errorCustom = require('Modules/api/_template.error');

// Mock
const ResponseObject = require('Kernel/ResponseObject.class');
const mockData = require('Modules/api/_template.mock.json');


class Custom {
   constructor() {
      this._storage = null;
   }

   init() {
      // New Optional Storage
      this._storage = new Storage('custom', {
         item: '',
      });
   }


   async apiMethod() {
      // -------------------------------------------------------------------------------------------
      // Developer mode
      // -------------------------------------------------------------------------------------------

      if (localStorage.getItem('development') === 'true') {
         // Mock response
         const resMockData = mockData.apiMethod;
         const hash = randomstring.generate(32);

         // Save data
         localStorage.setItem('key', 'value');
         this._storage.setData('key', resMockData.key);
         this.item = 'value';

         return new ResponseObject(`dev-${hash}`, 200, resMockData);
      }


      // -------------------------------------------------------------------------------------------
      // Production mode
      // -------------------------------------------------------------------------------------------

      let res;
      try {
         res = await connect.postJSON('/path', {
            key: 'value',
         });
      } catch (globalError) {
         throw globalError;
      }


      // -----------------------------------------------------------------------
      // Response codes
      // -----------------------------------------------------------------------

      // Success
      if (res.code === 200) {
         log.info('[200] Event description');

         // Global events - save data, etc.
         localStorage.setItem('key', 'value');
         this._storage.setData('key', res.body.key);
         this.item = 'value';

         return res;
      }

      // Failures
      if (res.code === 400) {
         throw new errorCustom.CustomError(res.hash, res.code, res.body, 'ERROR', 'Info');
      }


      // -----------------------------------------------------------------------
      // Unexpected Behaviour
      // -----------------------------------------------------------------------

      throw new errorConnect.UnexpectedError(
         res.hash, res.code, res.body,
         'UB in sign in process',
      );
   }


   // ----------------------------------------------------------------------------------------------
   // Helpers
   // ----------------------------------------------------------------------------------------------
}

module.exports = Custom;
