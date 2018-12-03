// Modules
const log = require('Modules/logger.app.module');

// API Modules
const AuthAPI = require('Modules/api/auth.module');
const StatsAPI = require('Modules/api/stats.module');
const ProjectsAPI = require('Modules/api/project.module');


class API {
   constructor() {
      log.info('API Initializer');

      this._auth = null;
      this._stats = null;
      this._projects = null;
   }

   init() {
      this.getAuth().init();
      this.getStats();
      this.getProjects();
   }

   getAuth() {
      if (this._auth === null) this._auth = new AuthAPI();
      return this._auth;
   }

   getStats() {
      if (this._stats === null) this._stats = new StatsAPI();
      return this._stats;
   }

   getProjects() {
      if (this._projects === null) this._projects = new ProjectsAPI();
      return this._projects;
   }
}

module.exports = API;
