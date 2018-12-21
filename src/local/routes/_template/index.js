// require('./index.scss');

const Page = require('Kernel/Page.class');

const Noty = require('noty');
const connect = require('Modules/connect.module');
const errorConnect = require('Modules/connect.error');
const template = require('./index.pug');

class Index extends Page {
   constructor(args, config) {
      super(args, config);
      this._template = template;
   }

   async __ajaxData() {
      // For the deatailed example - see this.apiRequest();
      await connect.ajaxRequest(
         async () => {},
         () => {},
      ).catch((err) => {
         // Everything is resolved, placeholder PropagationCancel
         // Need to stop renderings this page
         throw err;
      });
   }


   __render() {
      this._getRenderParent().innerHTML = this._template({
         key: 'value',
      });
   }


   __handlers() {}


   /**
    * @summary An example of ajax request method
    * @param {string} name
    * @param {string} desc
    */
   async apiRequest(param) {
      // Wait for the response
      await connect.ajaxRequest(
         async () => {
            // Request
            // -----------------------------------------------------------------
            // Siognle request
            const res = await evodoc.getAPI().getApiGroup().apiMethod(param);

            // Multiple request
            await Promise.all([
               evodoc.getAPI().getApiGroup().apiMethod(param),
               evodoc.getAPI().getApiGroup().apiMethod(param),
            ]).then((values) => {
               [
                  this._variableOne,
                  this._variableTwo,
               ] = values;
            });


            // Redirect
            evodoc.getRouter().load(`/project/${res.body.id}/view`);
         },

         (err) => {
            // Local error handling
            // -----------------------------------------------------------------
            if (err instanceof errorConnect.InvalidDataError) {
               // Handle error
               new Noty({
                  text: 'Something went wrong.',
                  type: 'error',
                  timeout: 5000,
               }).show();
               // Always throw an exception to show that error was handeled
               evodoc.getRouter().load('/error/404');
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
