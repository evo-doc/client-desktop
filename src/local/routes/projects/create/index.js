// Stylesheet
require('./index.scss');


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

   // __ajaxData() {}

   __handlers() {
      const buttonCreaterPoject = document.querySelector('#createrPoject');
      buttonCreaterPoject.addEventListener('click', () => {
         const projectName = document.querySelector('#projectName').value;
         const projectDescription = document.querySelector('#projectDescription').value;

         this.createProject(projectName, projectDescription);
      });
   }

   async createProject(name, desc) {
      try {
         const res = await evodoc.getAPI().getProjects().projectCreate(name, desc);

         evodoc.getRouter().load(`/project/${res.body.id}/view`);
      } catch (e) {
         // Error handling
         if (e instanceof errorProject.ProjectDataError) {
            if (e.body.invalid.indexOf('name') >= 0) {
               new Noty({
                  text: 'The project name is too short.',
                  type: 'error',
                  timeout: 5000,
               }).show();
            }
         }
      }
   }
}

module.exports = (config = {}) => ({
   config,
   Page: Index,
});
