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
            link: `/project/${this._args[1]}/edit`,
            icon: 'edit',
            name: 'Edit this project',
         },
      ];
   }


   async __ajaxData() {
      try {
         await Promise
            .all([
               evodoc.getAPI().getProjects().projectView(this._args[1]),
            ])
            .then((values) => {
               [
                  this._projectView,
               ] = values;
            });
      } catch (err) {
         evodoc.getRouter().load(`/error/${err.code}`);
         throw err;
      }
   }


   __render() {
      this._getRenderParent().innerHTML = this._template({
         project: this._projectView.body,
         projectId: this._args[1],
      });
   }


   // __handlers() {}
}

module.exports = (config = {}) => ({
   config,
   Page: Index,
});
