// Stylesheet
require('./index.scss');

const Noty = require('noty');
const Page = require('Kernel/Page.class');
const connect = require('Modules/connect.module');
const errorConnect = require('Modules/connect.error');
const template = require('./index.pug');


class Index extends Page {
   constructor(args, config) {
      super(args, config);
      this._template = template;

      this._sidebarButtons = [
         {
            link: `/project/${this._args[1]}/view`,
            icon: 'step-backward',
            name: 'Back to the project',
         },
      ];
   }

   async __ajaxData() {
      await connect.ajaxRequest(
         async () => {
            // Multiple request
            await Promise.all([
               evodoc.getAPI().getProjects().projectView(this._args[1]),
            ]).then((values) => {
               [
                  this._projectView,
                  // this._projectModules,
               ] = values;
            });
         },
         (err) => {
            // Solving local errors
            if (err instanceof errorConnect.InvalidDataError) {
               evodoc.getRouter().load('/error/404');
               return;
            }
            throw err;
         },
      ).catch((err) => {
         // Everything is resolved, placeholder PropagationCancel
         // Need to stop renderings this page
         throw err;
      });
   }


   __render() {
      this._getRenderParent().innerHTML = this._template({
         project: this._projectView.body,
         projectId: this._args[1],
      });
   }


   __handlers() {
      document.querySelector('#editPoject').addEventListener('submit', (evt) => {
         evt.preventDefault();
         this.editProject();
      });
      document.querySelector('#addCollab').addEventListener('submit', (evt) => {
         evt.preventDefault();
         this.addCollaborator();
      });

      document.querySelectorAll('.collaborators__item').forEach((item) => {
         item.addEventListener('click', (evt) => {
            global.a = evt;

            let div = evt.target;
            while (div.className.indexOf('collaborators__item') < 0) {
               div = div.parentElement;
            }

            this.removeCollaborator(div.innerText.trim());
         });
      });
   }


   /**
    * @summary Edit project
    */
   async editProject() {
      const name = document.querySelector('#name').value;
      const description = document.querySelector('#description').value;

      // Wait for the response
      await connect.ajaxRequest(
         async () => {
            // Request
            // -----------------------------------------------------------------
            // Signle request
            await evodoc.getAPI().getProjects().patchProject(
               this._args[1],
               {
                  name,
                  description,
               },
            );


            new Noty({
               text: 'Saved',
               type: 'success',
               timeout: 2000,
            }).show();
         },

         (err) => {
            // Local error handling
            // -----------------------------------------------------------------

            if (err instanceof errorConnect.InvalidDataError) {
               // Error handling
               if (err.body.invalid.indexOf('name') >= 0) {
                  new Noty({
                     text: 'The project name is too short.',
                     type: 'warning',
                     timeout: 5000,
                  }).show();
               }
               return;
            }

            throw err;
         },
      );
   }


   /**
    * @summary Add a collaborator
    */
   async addCollaborator() {
      const collaborator = document.querySelector('#collaborator').value;

      // Wait for the response
      await connect.ajaxRequest(
         async () => {
            // Request
            // -----------------------------------------------------------------
            // Signle request
            await evodoc.getAPI().getProjects().addCollaboratorToProject(
               this._args[1],
               collaborator,
               'contributor',
            );

            evodoc.getRouter().refresh();
         },

         (err) => {
            // Local error handling
            // -----------------------------------------------------------------

            if (err instanceof errorConnect.InvalidDataError) {
               // Error handling
               if (err.body.invalid.indexOf('username') >= 0) {
                  new Noty({
                     text: 'User does ot exist.',
                     type: 'warning',
                     timeout: 5000,
                  }).show();
               }
               // Error handling
               if (err.body.invalid.indexOf('role') >= 0) {
                  new Noty({
                     text: 'Wrong role.',
                     type: 'warning',
                     timeout: 5000,
                  }).show();
               }
               return;
            }

            throw err;
         },
      ).catch(() => {});
   }


   /**
    * @summary Add a collaborator
    */
   async removeCollaborator(username) {
      // Wait for the response
      await connect.ajaxRequest(
         async () => {
            // Request
            // -----------------------------------------------------------------
            // Signle request
            await evodoc.getAPI().getProjects().deleteCollaboratorFromProject(
               this._args[1],
               username,
            );

            evodoc.getRouter().refresh();
         },

         (err) => {
            // Local error handling
            // -----------------------------------------------------------------

            if (err instanceof errorConnect.InvalidDataError) {
               // Error handling
               if (err.body.invalid.indexOf('username') >= 0) {
                  new Noty({
                     text: 'User is not a collaborator of this project or does not exist.',
                     type: 'error',
                     timeout: 5000,
                  }).show();
               }
               return;
            }

            throw err;
         },
      ).catch(() => {});
   }
}

module.exports = (config = {}) => ({
   config,
   Page: Index,
});
