// FontAwesome library
require('@fortawesome/fontawesome-free/js/all');
// CSS
require('Styles/index.scss');

const Application = require('Kernel/Application.class');

// Application
global.evodoc = new Application();
evodoc.init();
