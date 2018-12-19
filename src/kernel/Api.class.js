// Modules
const log = require('Modules/logger.app.module');

// API Modules
const AuthAPI = require('Modules/api/auth.module');
const StatsAPI = require('Modules/api/stats.module');
const ProjectsAPI = require('Modules/api/project.module');
const UserPrivateAPI = require('Modules/api/userPrivate.module');
const UserPublicAPI = require('Modules/api/userPublic.module');
const ModulesAPI = require('Modules/api/modules.module');


class API {
   constructor() {
      log.info('API Initializer');

      this._auth = null;
      this._stats = null;
      this._projects = null;
      this._userPrivate = null;
      this._userPublic = null;
      this._modules = null;
   }

   init() {
      this.getAuth().init();
      this.getStats();
      this.getProjects();
      this.getUserPrivate();
      this.getUserPublic();
      this.getModules();
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

   getUserPublic() {
      if (this._userPublic === null) this._userPublic = new UserPublicAPI();
      return this._userPublic;
   }

   getModules() {
      if (this._modules === null) this._modules = new ModulesAPI();
      return this._modules;
   }
}

module.exports = API;
