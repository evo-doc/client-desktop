const log = require('Modules/logger.app.module');
const connect = require('Modules/connect.module');
const randomstring = require('randomstring');

// Error objects
const errorConnect = require('Modules/connect.error');
const errorProject = require('Modules/api/project.error');

// Mock
const ResponseObject = require('Kernel/ResponseObject.class');
const mockData = require('Modules/api/project.mock.json');


class Custom {
   constructor() {
      this._storage = null;
   }

   init() {}


   async projectCreate(name, description, collaborators = { contributors: [] }) {
      // -------------------------------------------------------------------------------------------
      // Developer mode
      // -------------------------------------------------------------------------------------------

      if (localStorage.getItem('development') === 'true') {
         // Mock response
         const resMockData = mockData.projectCreate;
         const hash = randomstring.generate(32);
         return new ResponseObject(`dev-${hash}`, 200, resMockData);
      }


      // -------------------------------------------------------------------------------------------
      // Production mode
      // -------------------------------------------------------------------------------------------

      let res;
      try {
         res = await connect.postJSON('/projects/project', {
            name,
            description,
            collaborators,
         });
      } catch (globalError) {
         throw globalError;
      }


      // -----------------------------------------------------------------------
      // Response codes
      // -----------------------------------------------------------------------

      // Success
      if (res.code === 200) {
         log.info('[200] Project was created');
         return res;
      }

      // Failures
      if (res.code === 400) {
         throw new errorProject.ProjectDataError(
            res.hash, res.code, res.body,
            'Project data are invalid or non-unique.',
         );
      }


      // -----------------------------------------------------------------------
      // Unexpected Behaviour
      // -----------------------------------------------------------------------

      throw new errorConnect.UnexpectedError(
         res.hash, res.code, res.body,
         'UB in project creating process',
      );
   }


   async projectView(id) {
      // -------------------------------------------------------------------------------------------
      // Developer mode
      // -------------------------------------------------------------------------------------------

      if (localStorage.getItem('development') === 'true') {
         // Mock response
         const resMockData = mockData.projectView;
         const hash = randomstring.generate(32);
         return new ResponseObject(`dev-${hash}`, 200, resMockData);
      }


      // -------------------------------------------------------------------------------------------
      // Production mode
      // -------------------------------------------------------------------------------------------

      let res;
      try {
         res = await connect.getJSON(`/projects/${id}`);
      } catch (globalError) {
         throw globalError;
      }


      // -----------------------------------------------------------------------
      // Response codes
      // -----------------------------------------------------------------------

      // Success
      if (res.code === 200) {
         log.info('[200] Project was edited');
         return res;
      }

      // Failures
      if (res.code === 400) {
         throw new errorProject.ProjectNotFoundError(
            res.hash, 404, res.body,
            `Project with ID=${id} not found`,
         );
      }


      // -----------------------------------------------------------------------
      // Unexpected Behaviour
      // -----------------------------------------------------------------------

      throw new errorConnect.UnexpectedError(
         res.hash, res.code, res.body,
         'UB in project viewing process',
      );
   }


   async projectPatch(id, name, description, collaborators) {
      // -------------------------------------------------------------------------------------------
      // Developer mode
      // -------------------------------------------------------------------------------------------

      if (localStorage.getItem('development') === 'true') {
         // Mock response
         const resMockData = mockData.projectPatch;
         const hash = randomstring.generate(32);
         return new ResponseObject(`dev-${hash}`, 200, resMockData);
      }


      // -------------------------------------------------------------------------------------------
      // Production mode
      // -------------------------------------------------------------------------------------------

      let res;
      try {
         res = await connect.patchJSON(`/projects/${id}`, {
            name,
            description,
            collaborators,
         });
      } catch (globalError) {
         throw globalError;
      }


      // -----------------------------------------------------------------------
      // Response codes
      // -----------------------------------------------------------------------

      // Success
      if (res.code === 200) {
         log.info('[200] Project was patched');
         return res;
      }

      // Failures
      if (res.code === 400) {
         throw new errorProject.ProjectDataError(
            res.hash, res.code, res.body,
            'Project data are invalid or non-unique.',
         );
      }


      // -----------------------------------------------------------------------
      // Unexpected Behaviour
      // -----------------------------------------------------------------------

      throw new errorConnect.UnexpectedError(
         res.hash, res.code, res.body,
         'UB in project patching process',
      );
   }


   async projectDelete(id) {
      // -------------------------------------------------------------------------------------------
      // Developer mode
      // -------------------------------------------------------------------------------------------

      if (localStorage.getItem('development') === 'true') {
         // Mock response
         const resMockData = mockData.projectDelete;
         const hash = randomstring.generate(32);
         return new ResponseObject(`dev-${hash}`, 200, resMockData);
      }


      // -------------------------------------------------------------------------------------------
      // Production mode
      // -------------------------------------------------------------------------------------------

      let res;
      try {
         res = await connect.deleteJSON(`/projects/${id}`);
      } catch (globalError) {
         throw globalError;
      }


      // -----------------------------------------------------------------------
      // Response codes
      // -----------------------------------------------------------------------

      // Success
      if (res.code === 200) {
         log.info('[200] Project was deleted');
         return res;
      }

      // Failures
      if (res.code === 400) {
         throw new errorProject.ProjectNotFoundError(
            res.hash, res.code, res.body,
            `Project with ID=${id} not found`,
         );
      }


      // -----------------------------------------------------------------------
      // Unexpected Behaviour
      // -----------------------------------------------------------------------

      throw new errorConnect.UnexpectedError(
         res.hash, res.code, res.body,
         'UB in project deleting process',
      );
   }


   async addCollaboratorToProject(id, username, role) {
      // -------------------------------------------------------------------------------------------
      // Developer mode
      // -------------------------------------------------------------------------------------------

      if (localStorage.getItem('development') === 'true') {
         // Mock response
         const resMockData = mockData.addCollaboratorToProject;
         const hash = randomstring.generate(32);
         return new ResponseObject(`dev-${hash}`, 200, resMockData);
      }


      // -------------------------------------------------------------------------------------------
      // Production mode
      // -------------------------------------------------------------------------------------------

      let res;
      try {
         res = await connect.postJSON(`/projects/${id}/users`, {
            username,
            role,
         });
      } catch (globalError) {
         throw globalError;
      }


      // -----------------------------------------------------------------------
      // Response codes
      // -----------------------------------------------------------------------

      // Success
      if (res.code === 200) {
         log.info('[200] A collaborator was added to project');
         return res;
      }

      // Success
      if (res.code === 202) {
         log.info(`[200] User ${username} is already a collaborator`);
         return res;
      }

      // Failures
      if (res.code === 400) {
         throw new errorProject.ProjectCollabOrRoleError(
            res.hash, res.code, res.body,
            'Username or role is invalid',
         );
      }


      // -----------------------------------------------------------------------
      // Unexpected Behaviour
      // -----------------------------------------------------------------------

      throw new errorConnect.UnexpectedError(
         res.hash, res.code, res.body,
         'UB in collaborator adding process',
      );
   }


   async patchCollaboratorOfProject(id, username, role) {
      // -------------------------------------------------------------------------------------------
      // Developer mode
      // -------------------------------------------------------------------------------------------

      if (localStorage.getItem('development') === 'true') {
         // Mock response
         const resMockData = mockData.patchCollaboratorOfProject;
         const hash = randomstring.generate(32);
         return new ResponseObject(`dev-${hash}`, 200, resMockData);
      }


      // -------------------------------------------------------------------------------------------
      // Production mode
      // -------------------------------------------------------------------------------------------

      let res;
      try {
         res = await connect.patchJSON(`/projects/${id}/users`, {
            username,
            role,
         });
      } catch (globalError) {
         throw globalError;
      }


      // -----------------------------------------------------------------------
      // Response codes
      // -----------------------------------------------------------------------

      // Success
      if (res.code === 200) {
         log.info('[200] Collaborator was patched');
         return res;
      }

      // Failures
      if (res.code === 400) {
         throw new errorProject.ProjectCollabOrRoleError(
            res.hash, res.code, res.body,
            'Username or role is invalid',
         );
      }


      // -----------------------------------------------------------------------
      // Unexpected Behaviour
      // -----------------------------------------------------------------------

      throw new errorConnect.UnexpectedError(
         res.hash, res.code, res.body,
         'UB in collaborator patching process',
      );
   }


   async deleteCollaboratorFromProject(id, username) {
      // -------------------------------------------------------------------------------------------
      // Developer mode
      // -------------------------------------------------------------------------------------------

      if (localStorage.getItem('development') === 'true') {
         // Mock response
         const resMockData = mockData.deleteCollaboratorFromProject;
         const hash = randomstring.generate(32);
         return new ResponseObject(`dev-${hash}`, 200, resMockData);
      }


      // -------------------------------------------------------------------------------------------
      // Production mode
      // -------------------------------------------------------------------------------------------

      let res;
      try {
         res = await connect.deleteJSON(`/projects/${id}/users`, {
            username,
         });
      } catch (globalError) {
         throw globalError;
      }


      // -----------------------------------------------------------------------
      // Response codes
      // -----------------------------------------------------------------------

      // Success
      if (res.code === 200) {
         log.info('[200] Collaborator was removed');
         return res;
      }

      // Failures
      if (res.code === 400) {
         throw new errorProject.ProjectCollabOrRoleError(
            res.hash, res.code, res.body,
            'Username is invalid',
         );
      }


      // -----------------------------------------------------------------------
      // Unexpected Behaviour
      // -----------------------------------------------------------------------

      throw new errorConnect.UnexpectedError(
         res.hash, res.code, res.body,
         'UB in collaboration removing process',
      );
   }


   // ----------------------------------------------------------------------------------------------
   // Helpers
   // ----------------------------------------------------------------------------------------------
}

module.exports = Custom;
