// Stylesheet
require('./index.scss');


const Page = require('Kernel/Page.class');
const template = require('./index.pug');


class Index extends Page {
   constructor(args, config) {
      super(args, config);
      this._template = template;
   }

   __ajaxData() {}


   __render() {
      const code = this._getArgs()[1];
      this._getRenderParent().innerHTML = this._template({
         error: {
            code,
            message: evodoc.getLocalization().getPhrase(`error.${code}`),
         },
      });
   }


   __handlers() {}
}

module.exports = (config = {}) => ({
   config,
   Page: Index,
});
