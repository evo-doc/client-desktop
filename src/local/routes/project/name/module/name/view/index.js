// Stylesheet
require('./index.scss');

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
            link: `/project/${this._args[1]}/module/${this._args[2]}/edit`,
            icon: 'edit',
            name: 'Edit module',
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
      document.querySelector('#exportPdf').addEventListener('click', (evt) => {
         evt.preventDefault();
         this.exportPdf();
      });
   }


   /**
    * @summary Create a new module and load it
    */
   async exportPdf() {
      /*
      await connect.ajaxRequest(
         async () => {
            await evodoc.getAPI().getModules().buildModule(this._args[2]);
         },
         (err) => {
            throw err;
         },
      );
      */
   }
}

module.exports = (config = {}) => ({
   config,
   Page: Index,
});
