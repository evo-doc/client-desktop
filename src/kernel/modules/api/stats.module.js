const log = require('Modules/logger.app.module');
const connect = require('Modules/connect.module');
const randomstring = require('randomstring');

// Error objects
const errorConnect = require('Modules/connect.error');

// Mock
const ResponseObject = require('Kernel/ResponseObject.class');
const mockData = require('Modules/api/stats.mock.json');


class Stats {
   async common() {
      // -------------------------------------------------------------------------------------------
      // Developer mode
      // -------------------------------------------------------------------------------------------

      if (localStorage.getItem('development') === 'true') {
         // Mock response
         const resMockData = mockData.common;
         const hash = randomstring.generate(32);

         return new ResponseObject(`dev-${hash}`, 200, resMockData);
      }

      // -------------------------------------------------------------------------------------------
      // Production mode
      // -------------------------------------------------------------------------------------------

      let res;
      try {
         res = await connect.getJSON('/stats/common');
      } catch (globalError) {
         throw globalError;
      }

      // -----------------------------------------------------------------------
      // Response codes
      // -----------------------------------------------------------------------

      // Success
      if (res.code === 200) {
         log.info('[200] Common stats received');
         return res;
      }

      // -----------------------------------------------------------------------
      // Unexpected Behaviour
      // -----------------------------------------------------------------------

      throw new errorConnect.UnexpectedError(
         res.hash, res.code, res.body,
         'UB in stats common request',
      );
   }

   async popularPackages() {
      // -------------------------------------------------------------------------------------------
      // Developer mode
      // -------------------------------------------------------------------------------------------

      if (localStorage.getItem('development') === 'true') {
         // Mock response
         const resMockData = mockData.popularPackages;
         const hash = randomstring.generate(32);

         return new ResponseObject(`dev-${hash}`, 200, resMockData);
      }

      // -------------------------------------------------------------------------------------------
      // Production mode
      // -------------------------------------------------------------------------------------------

      let res;
      try {
         res = await connect.postJSON('/path', {
            limit: 10,
         });
      } catch (globalError) {
         throw globalError;
      }

      // -----------------------------------------------------------------------
      // Response codes
      // -----------------------------------------------------------------------

      // Success
      if (res.code === 200) {
         log.info('[200] Popular packages received');
         return res;
      }

      // Failures
      if (res.code === 400) {
         throw new errorConnect.InvalidLimitError(
            res.hash, res.code, res.body,
            'Limit value is incorrect',
         );
      }

      // -----------------------------------------------------------------------
      // Unexpected Behaviour
      // -----------------------------------------------------------------------

      throw new errorConnect.UnexpectedError(
         res.hash, res.code, res.body,
         'UB in popular packages request',
      );
   }


   // ----------------------------------------------------------------------------------------------
   // Helpers
   // ----------------------------------------------------------------------------------------------
}

module.exports = Stats;
