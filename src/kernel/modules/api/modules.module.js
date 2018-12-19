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


   async getAllModules(projectId) {
      // -------------------------------------------------------------------------------------------
      // Developer mode
      // -------------------------------------------------------------------------------------------
      if (localStorage.getItem('development') === 'true') {
         // Mock response
         const resMockData = mockData.getAllModules;
         const hash = randomstring.generate(32);
         return new ResponseObject(`dev-${hash}`, 200, resMockData);
      }


      // -------------------------------------------------------------------------------------------
      // Production mode
      // -------------------------------------------------------------------------------------------
      let res;
      try {
         res = await connect.getJSON(`/projects/${projectId}/modules`);
      } catch (globalError) {
         throw globalError;
      }


      // -----------------------------------------------------------------------
      // Response codes
      // -----------------------------------------------------------------------
      // Success
      if (res.code === 200) {
         log.info('[200] Get all modules');
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
         'UB in getAllModules process',
      );
   }


   async getModule(moduleId) {
      // -------------------------------------------------------------------------------------------
      // Developer mode
      // -------------------------------------------------------------------------------------------
      if (localStorage.getItem('development') === 'true') {
         // Mock response
         const resMockData = mockData.getModule;
         const hash = randomstring.generate(32);
         return new ResponseObject(`dev-${hash}`, 200, resMockData);
      }


      // -------------------------------------------------------------------------------------------
      // Production mode
      // -------------------------------------------------------------------------------------------
      let res;
      try {
         res = await connect.getJSON(`/modules/${moduleId}`);
      } catch (globalError) {
         throw globalError;
      }


      // -----------------------------------------------------------------------
      // Response codes
      // -----------------------------------------------------------------------
      // Success
      if (res.code === 200) {
         log.info('[200] Get module');
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
         'UB in getModule process',
      );
   }

   async createModule(data) {
      // -------------------------------------------------------------------------------------------
      // Production mode
      // -------------------------------------------------------------------------------------------
      let res;
      try {
         res = await connect.postJSON('/modules', data);
      } catch (globalError) {
         throw globalError;
      }


      // -----------------------------------------------------------------------
      // Response codes
      // -----------------------------------------------------------------------
      // Success
      if (res.code === 200) {
         log.info('[200] Create module');
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
         'UB in createModule process',
      );
   }

   async editModule(data, moduleId) {
      // -------------------------------------------------------------------------------------------
      // Production mode
      // -------------------------------------------------------------------------------------------
      let res;
      try {
         res = await connect.patchJSON(`/modules/${moduleId}`, data);
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
         'UB in editModule process',
      );
   }

   async deleteModule(moduleId) {
      // -------------------------------------------------------------------------------------------
      // Production mode
      // -------------------------------------------------------------------------------------------
      let res;
      try {
         res = await connect.postJSON(`/modules/${moduleId}`);
      } catch (globalError) {
         throw globalError;
      }


      // -----------------------------------------------------------------------
      // Response codes
      // -----------------------------------------------------------------------
      // Success
      if (res.code === 200) {
         log.info('[200] Module delete');
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
         'UB in deleteModule process',
      );
   }

   async exportModule(moduleId, extension) {
      // -------------------------------------------------------------------------------------------
      // Production mode
      // -------------------------------------------------------------------------------------------
      let res;
      try {
         res = await connect.postJSON(`/modules/${moduleId}/export`, {
            extension,
         });
      } catch (globalError) {
         throw globalError;
      }


      // -----------------------------------------------------------------------
      // Response codes
      // -----------------------------------------------------------------------
      // Success
      if (res.code === 200) {
         log.info('[200] Export module');
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
         'UB in export module process',
      );
   }

   // ----------------------------------------------------------------------------------------------
   // Helpers
   // ----------------------------------------------------------------------------------------------
}

module.exports = Custom;
