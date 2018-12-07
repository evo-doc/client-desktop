// Stylesheet
require('./index.scss');


const Page = require('Kernel/Page.class');
const template = require('./index.pug');


class Index extends Page {
   constructor(args, config) {
      super(args, config);
      this._template = template;

      this.stats = null;
   }

   async __ajaxData() {
      try {
         // this.stats = await evodoc.getAPI().getStats().common();
      } catch (err) {
         evodoc.getRouter().load(`/error/${err.code}`);
         throw err;
      }
   }


   __render() {
      this._getRenderParent().innerHTML = this._template({
         // stats: {
         //    users: this.stats.body.users,
         //    packages: this.stats.body.packages,
         //    projects: this.stats.body.projects,
         // },
      });
   }


   // __handlers() {}
}

module.exports = (config = {}) => ({
   config,
   Page: Index,
});
