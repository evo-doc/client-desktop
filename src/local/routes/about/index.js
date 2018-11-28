// Stylesheet
require('./index.scss');
const { shell } = require('electron');

const Page = require('Kernel/Page.class');
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
      document.getElementById('about__organization').addEventListener('click', (e) => {
         e.preventDefault();
         shell.openExternal('https://github.com/evo-doc');
      });
      document.getElementById('about__backend').addEventListener('click', (e) => {
         e.preventDefault();
         shell.openExternal('https://github.com/evo-doc/backend');
      });
      document.getElementById('about__frontend_desktop').addEventListener('click', (e) => {
         e.preventDefault();
         shell.openExternal('https://github.com/evo-doc/client-desktop');
      });
   }
}

module.exports = (config = {}) => ({
   config,
   Page: Index,
});
