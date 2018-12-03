// Modules
const log = require('Modules/logger.app.module');

// API Modules
const AuthAPI = require('Modules/api/auth.module');
const StatsAPI = require('Modules/api/stats.module');


class API {
   constructor() {
      log.info('API Initializer');

      this._auth = null;
      this._stats = null;
   }

   init() {
      this.getAuth().init();
      this.getStats();
   }

   getAuth() {
      if (this._auth === null) this._auth = new AuthAPI();
      return this._auth;
   }

   getStats() {
      if (this._stats === null) this._stats = new StatsAPI();
      return this._stats;
   }
}

module.exports = API;
