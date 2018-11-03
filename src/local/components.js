const log = require('Modules/logger.app.module');

const components = {};


log.debug('Components Loading');

// TEMPLATE - ./**/index.ejs
((files) => {
   files.keys().forEach((file) => {
      const pathSplit = file.split('/');
      const id = pathSplit.slice(1, -1).join('.');
      components[id] = files(file);
      log.trace(`Component [LOADED]: ${id}`);
   });
})(require.context('./components/', true, /index\.pug$/));


// STYLESHEET - ./**/index.scss
((files) => {
   files.keys().forEach((file) => {
      files(file);
   });
})(require.context('./components/', true, /index\.scss$/));

log.debug('Components Loading');

module.exports = components;
