// Modules
const log = require('Modules/logger.app.module');

// API Modules
const AuthAPI = require('Modules/api/auth.module');


class API {
   constructor() {
      log.info('API Initializer');

      this._auth = null;
   }

   init() {
      this.getAuth().init();
   }

   getAuth() {
      if (this._auth === null) this._auth = new AuthAPI();
      return this._auth;
   }
}

module.exports = API;
