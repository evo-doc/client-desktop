const log = require('Modules/logger.app.module.js');

const Localization = require('Kernel/Localization.class');
const Router = require('Kernel/Router.class');
const Api = require('Kernel/Api.class');


class Application {
   /**
    * @summary Application container
    * @class
    *
    * @returns {Application} Application instance
    *
    * @example <caption>New Application instance</caption>
    * const App = new Application();
    * App.init();
    */
   constructor() {
      this._router = null;
      this._localization = null;
      this._request = null;
      this._api = null;
   }

   init() {
      log.info('Application Initializer');

      this.getLocalization().init();
      this.getAPI().init();
      this.getRouter().init();
   }

   /**
    * @summary Get singleton instance of Localization class
    * @return {object} Localization instance
    */
   getLocalization() {
      if (this._localization === null) this._localization = new Localization();
      return this._localization;
   }

   /**
    * @summary Get singleton instance of Router class
    * @return {object} Router instance
    */
   getRouter() {
      if (this._router === null) this._router = new Router();
      return this._router;
   }

   /**
    * @summary Get singleton instance of API class
    * @return {object} API instance
    */
   getAPI() {
      if (this._api === null) this._api = new Api();
      return this._api;
   }
}

module.exports = Application;
