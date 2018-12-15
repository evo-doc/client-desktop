// Stylesheet
require('./index.scss');


const Page = require('Kernel/Page.class');
const template = require('./index.pug');


class Index extends Page {
   constructor(args, config) {
      super(args, config);
      this._template = template;

      this._sidebarButtons = [
         {
            link: '/projects/create',
            icon: 'plus',
            name: 'Create a Project',
         },
      ];
   }

   async __ajaxData() {
      try {
         await Promise
            .all([
               evodoc.getAPI().getUserPrivate().getAccessibleProjects(5),
            ])
            .then((values) => {
               [
                  this._getAccessibleProjects,
               ] = values;
            });
      } catch (err) {
         evodoc.getRouter().load(`/error/${err.code}`);
         throw err;
      }
   }

   __render() {
      this._getRenderParent().innerHTML = this._template({
         projects: this._getAccessibleProjects.body.projects.data,
      });
   }

   // __handlers() {}
}

module.exports = (config = {}) => ({
   config,
   Page: Index,
});
