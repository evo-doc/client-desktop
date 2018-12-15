// Modules
const log = require('Modules/logger.app.module');

// API Modules
const AuthAPI = require('Modules/api/auth.module');
const StatsAPI = require('Modules/api/stats.module');
const ProjectsAPI = require('Modules/api/project.module');
const UserPrivateAPI = require('Modules/api/userPrivate.module');


class API {
   constructor() {
      log.info('API Initializer');

      this._auth = null;
      this._stats = null;
      this._projects = null;
      this._userPrivate = null;
   }

   init() {
      this.getAuth().init();
      this.getStats();
      this.getProjects();
      this.getUserPrivate();
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

   getUserPrivate() {
      if (this._userPrivate === null) this._userPrivate = new UserPrivateAPI();
      return this._userPrivate;
   }
}

module.exports = API;
