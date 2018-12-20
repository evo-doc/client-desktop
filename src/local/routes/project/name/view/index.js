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
            link: `/project/${this._args[1]}/edit`,
            icon: 'edit',
            name: 'Edit this project',
         },
      ];
   }


   async __ajaxData() {
      await connect.ajaxRequest(
         async () => {
            // Multiple request
            await Promise.all([
               evodoc.getAPI().getProjects().projectView(this._args[1]),
               evodoc.getAPI().getModules().getAllModules(this._args[1]),
            ]).then((values) => {
               [
                  this._projectView,
                  this._projectModules,
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
         // modules: this._projectModules.body,
      });
   }


   // __handlers() {}
}

module.exports = (config = {}) => ({
   config,
   Page: Index,
});
