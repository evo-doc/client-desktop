// Stylesheet
require('./index.scss');


const Page = require('Kernel/Page.class');
const template = require('./index.pug');


class Index extends Page {
   constructor(args, config) {
      super(args, config);
      this._template = template;
   }

   __render() {
      const data = {
         projectName: this._getArgs()[1],
         moduleName: this._getArgs()[2],
      };
      console.log(data);

      this._getRenderParent().innerHTML = this._template(data);
   }

   // __ajaxData() {}

   // __handlers() {}
}

module.exports = (config = {}) => ({
   config,
   Page: Index,
});
