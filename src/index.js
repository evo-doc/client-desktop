// FontAwesome library
require('@fortawesome/fontawesome-free/js/all');
// CSS
require('Styles/index.scss');
// Modules
require('Modules/notifications.module');

const Application = require('Kernel/Application.class');

// Application
global.evodoc = new Application();
evodoc.init();

evodoc.getRouter().refresh();
