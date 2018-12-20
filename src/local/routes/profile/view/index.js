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
            link: '/profile/edit',
            icon: 'edit',
            name: 'Settings',
         },
      ];
   }

   async __ajaxData() {
      await connect.ajaxRequest(
         async () => {
            // Multiple request
            await Promise.all([
               evodoc.getAPI().getUserPrivate().getOwnAccount(),
               evodoc.getAPI().getUserPrivate().getAccessibleProjects(5),
            ]).then((values) => {
               [
                  this._getOwnAccount,
                  this._getAccessibleProjects,
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
      // Onwer tags
      for (let i = 0; i < this._getAccessibleProjects.body.projects.data.length; i++) {
         const owner = this._getAccessibleProjects.body.projects.data[i][1];
         const username = evodoc.getAPI().getAuth().getUsername();
         if (owner === username) {
            this._getAccessibleProjects.body.projects.data[i][1] = true;
         }
      }


      this._getRenderParent().innerHTML = this._template({
         username: this._getOwnAccount.body.username,
         email: this._getOwnAccount.body.email,
         avatar: `https://www.gravatar.com/avatar/${this._getOwnAccount.body.avatar}?d=identicon&f=y&s=180`,
         name: this._getOwnAccount.body.name
            ? this._getOwnAccount.body.name
            : this._getOwnAccount.body.username,
         github: this._getOwnAccount.body.github
            ? this._getOwnAccount.body.github
            : null,
         twitter: this._getOwnAccount.body.twitter
            ? this._getOwnAccount.body.twitter
            : null,
         projects: this._getAccessibleProjects.body.projects.data,
      });
   }


   // __handlers() {}
}

module.exports = (config = {}) => ({
   config,
   Page: Index,
});
