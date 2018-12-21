// Stylesheet
require('./index.scss');

const connect = require('Modules/connect.module');

const Page = require('Kernel/Page.class');
const template = require('./index.pug');


class Index extends Page {
   constructor(args, config) {
      super(args, config);
      this._template = template;

      this.stats = null;
   }

   async __ajaxData() {
      await connect.ajaxRequest(
         async () => {
            // Multiple request
            await Promise.all([
               evodoc.getAPI().getStats().common(),
               evodoc.getAPI().getUserPrivate().getAccessibleProjects(5),
            ]).then((values) => {
               [
                  this._stats,
                  this._getAccessibleProjects,
               ] = values;
            });
         },
         (err) => {
            throw err;
         },
      ).catch((err) => {
         // Everything is resolved, placeholder PropagationCancel
         // Need to stop renderings this page
         throw err;
      });
   }


   __render() {
      // Onwer tags
      const username = evodoc.getAPI().getAuth().getUsername();
      for (let i = 0; i < this._getAccessibleProjects.body.projects.data.length; i++) {
         const owner = this._getAccessibleProjects.body.projects.data[i][1];
         if (owner === username) {
            this._getAccessibleProjects.body.projects.data[i][1] = true;
         }
      }


      this._getRenderParent().innerHTML = this._template({
         stats: this._stats.body,
         projects: this._getAccessibleProjects.body.projects.data,
      });
   }


   // __handlers() {}
}

module.exports = (config = {}) => ({
   config,
   Page: Index,
});
