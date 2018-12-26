// Stylesheet
require('./index.scss');


const Page = require('Kernel/Page.class');
const Noty = require('noty');
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
      ];
   }


   __render() {
      this._getRenderParent().innerHTML = this._template();
   }


   __handlers() {
      document.querySelector('#createModule').addEventListener('submit', (evt) => {
         evt.preventDefault();
         this.createModule();
      });
   }


   /**
    * @summary Create a new module and load it
    */
   async createModule() {
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
            const res = await evodoc.getAPI().getModules().createModule(data);
            evodoc.getRouter().load(`/project/${this._args[1]}/module/${res.body.id}/view`);
         },
         (err) => {
            // Solving local errors
            if (err instanceof errorConnect.InvalidDataError) {
               if (err.body.invalid.indexOf('name') >= 0) {
                  new Noty({
                     text: 'The module name is too short.',
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
}

module.exports = (config = {}) => ({
   config,
   Page: Index,
});
