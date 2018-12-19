// Stylesheet
require('./index.scss');


const Page = require('Kernel/Page.class');
const connect = require('Modules/connect.module');
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
      // For the deatailed example - see this.apiRequest();
      await connect.ajaxRequest(
         async () => {
            this._getAccessibleProjects = await evodoc
               .getAPI().getUserPrivate().getAccessibleProjects();
         },
         () => {},
      ).catch((err) => {
         // Everything is resolved, placeholder PropagationCancel
         // Need to stop renderings this page
         throw err;
      });
   }

   __render() {
      // Onwer tags
      for (let i = 0; i < this._getAccessibleProjects.body.projects.data.length; i++) {
         const owner = this._getAccessibleProjects.body.projects.data[i][1];
         const username = evodoc.getAPI().getAuth().getUsername();
         if (owner === username) {
            this._getAccessibleProjects.body.projects.data[i][1] = true;
         }
      }


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
