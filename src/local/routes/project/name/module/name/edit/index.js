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
            icon: 'fast-backward',
            name: 'Back to the project',
         },
         {
            link: `/project/${this._args[1]}/modules/view`,
            icon: 'step-backward',
            name: 'View modules',
         },
         {
            link: `/project/${this._args[1]}/module/${this._args[2]}/view`,
            icon: 'file',
            name: 'Back to the module',
         },
      ];
   }


   async __ajaxData() {
      await connect.ajaxRequest(
         async () => {
            // Multiple request
            await Promise.all([
               evodoc.getAPI().getModules().getModule(this._args[2]),
            ]).then((values) => {
               [
                  this._moduleView,
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
         projectId: this._args[1],
         module: this._moduleView.body,
      });
   }

   __handlers() {
      document.querySelector('#moduleType').value = this._moduleView.body.content.type;
      document.querySelector('#moduleDep').value = this._moduleView.body.dependency;

      document.querySelector('#editModule').addEventListener('submit', (evt) => {
         evt.preventDefault();
         this.editModule();
      });

      document.querySelector('#removeModule').addEventListener('click', (evt) => {
         evt.preventDefault();
         this.removeModule();
      });
   }


   /**
    * @summary Create a new module and load it
    */
   async editModule() {
      const name = document.querySelector('#moduleName').value;
      const description = document.querySelector('#moduleDesc').value;
      const dependency = document.querySelector('#moduleDep').value;
      const type = document.querySelector('#moduleType').value;
      const body = document.querySelector('#moduleText').value;

      const data = {
         project: this._args[1],
         name,
         description,
         dependency,
         content: {
            type,
            body,
         },
      };

      await connect.ajaxRequest(
         async () => {
            await evodoc.getAPI().getModules().editModule(data, this._args[2]);
            evodoc.getRouter().load(`/project/${this._args[1]}/module/${this._args[2]}/view`);
         },
         (err) => {
            // Solving local errors
            if (err instanceof errorConnect.InvalidDataError) {
               if (err.body.invalid.indexOf('name') >= 0) {
                  new Noty({
                     text: 'The module name is too short or not unique.',
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
    * @summary Create a new module and load it
    */
   async removeModule() {
      await connect.ajaxRequest(
         async () => {
            await evodoc.getAPI().getModules().deleteModule(this._args[2]);
            evodoc.getRouter().load(`/project/${this._args[1]}/modules/view`);
         },
         (err) => {
            throw err;
         },
      );
   }
}

module.exports = (config = {}) => ({
   config,
   Page: Index,
});
