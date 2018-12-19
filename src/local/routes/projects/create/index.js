// Stylesheet
require('./index.scss');

const connect = require('Modules/connect.module');
const errorConnect = require('Modules/connect.error');

const Noty = require('noty');
const Page = require('Kernel/Page.class');
const errorProject = require('Modules/api/project.error');
const template = require('./index.pug');

class Index extends Page {
   constructor(args, config) {
      super(args, config);
      this._template = template;
   }

   __render() {
      this._getRenderParent().innerHTML = this._template();
   }

   __ajaxData() {}

   __handlers() {
      const buttonCreaterPoject = document.querySelector('#createrPoject');
      buttonCreaterPoject.addEventListener('click', () => {
         const projectName = document.querySelector('#projectName').value;
         const projectDescription = document.querySelector('#projectDescription').value;

         this.createProject(projectName, projectDescription);
      });
   }


   /**
    * @summary Create a new project and load it
    * @param {string} name
    * @param {string} desc
    */
   async createProject(name, desc) {
      await connect.ajaxRequest(
         async () => {
            const res = await evodoc.getAPI().getProjects().projectCreate(name, desc);
            evodoc.getRouter().load(`/project/${res.body.id}/view`);
         },
         (err) => {
            // Error handling
            if (err instanceof errorProject.ProjectDataError) {
               if (err.body.invalid.indexOf('name') >= 0) {
                  new Noty({
                     text: 'The project name is too short.',
                     type: 'error',
                     timeout: 5000,
                  }).show();
               }
               throw new errorConnect.PropagationCancel();
            }
         },
      );
   }
}

module.exports = (config = {}) => ({
   config,
   Page: Index,
});
