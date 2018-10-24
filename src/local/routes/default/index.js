const Page = require('Kernel/Page.class');

class Index extends Page {
   constructor(args, config) {
      super(args, config);
      this._template = null;
   }
}

module.exports = (config = {}) => ({
   config,
   Page: Index,
});
