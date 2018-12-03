const log = require('Modules/logger.app.module');

module.exports.ProjectDataError = class ProjectDataError extends Error {
   constructor(hash, code, body, ...params) {
      super(...params);

      if (Error.captureStackTrace) {
         Error.captureStackTrace(this, ProjectDataError);
      }

      this.hash = hash;
      this.code = code;
      this.body = body;

      log.info(`[${code}]: ${this.message} (${hash})`);
   }
};

module.exports.ProjectNotFoundError = class ProjectNotFoundError extends Error {
   constructor(hash, code, body, ...params) {
      super(...params);

      if (Error.captureStackTrace) {
         Error.captureStackTrace(this, ProjectNotFoundError);
      }

      this.hash = hash;
      this.code = code;
      this.body = body;

      log.error(`[${code}]: ${this.message} (${hash})`);
   }
};

module.exports.ProjectCollabOrRoleError = class ProjectCollabOrRoleError extends Error {
   constructor(hash, code, body, ...params) {
      super(...params);

      if (Error.captureStackTrace) {
         Error.captureStackTrace(this, ProjectCollabOrRoleError);
      }

      this.hash = hash;
      this.code = code;
      this.body = body;

      log.error(`[${code}]: ${this.message} (${hash})`);
   }
};


module.exports.ProjectCollabUpadteError = class ProjectCollabUpadteError extends Error {
   constructor(hash, code, body, ...params) {
      super(...params);

      if (Error.captureStackTrace) {
         Error.captureStackTrace(this, ProjectCollabUpadteError);
      }

      this.hash = hash;
      this.code = code;
      this.body = body;

      log.error(`[${code}]: ${this.message} (${hash})`);
   }
};
