<img align="right" width="100px" src="https://raw.githubusercontent.com/evo-doc/client-desktop/master/src/local/resources/images/logotype.png">

# EvoDoc v2

A desktop client for macOS, linux and windows. Based on [Electron](https://electronjs.org). [Webpack](http://webpack.js.org) is used as an app bundler. A stylesheet language is [SCSS](https://sass-lang.com), template engine – [PugJS](https://pugjs.org/).

## Getting Started

### Requirements & Dependencies

-  NodeJS `>=8.0.0`
-  Yarn `>=1.9.0`

Install project dependencies:

```
yarn
```

\+ install all peer dependencies from `package.json`

### Bundling

**Development:** An app bundle with source maps, watching files and without css extraction.

```
yarn build:dev
yarn start:dev # background
```

**Production:** A production bundle. All source codes are minified, css files are extracted, etc.

```
yarn build:prod
yarn start:prod # background
```

**Packager:** Bundle the whole app into 1 execution file (`.app`, `.exe`, etc.).

```
yarn packager:mac # macOS application
yarn packager:lin # linux application
yarn packager:win # windows application
```

### Clean

Universal clean task:

```
yarn clean
```

Other tasks:

```
yarn clean:build     # clean build folder
yarn clean:release   # clean releases
yarn clean:logs      # clean logs
```

## Code style

### Javascript

Project uses eslint utility. [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript) is used as a basic style guide, other styles are defined in `.eslintrc.json`. Please don't use olded syntax of ajax requests (XMLHttpRequest), prototype declarations etc.

## Structure

```
.
├── bin           # binary files
├── build         # bundled application
├── electron      # electron configuration
├── logs          # developmetn logs
├── release       # bundled releases
├── src              #sources
│   ├── config          # app configuration files
│   ├── kernel          # app functionality core
│   │   └── modules        # modules
│   └── local           # app content
│       ├── components     # repeatable parts of code
│       ├── localization   # json files with translations
│       │   └── xx.json
│       ├── resources      # global resources (may be used everywhere)
│       ├── routes
│       │   └── page          # route name (usually a part between ../xxx/.. in URL)
│       │       ├── js           # page secondary js
│       │       ├── pug          # page secondary markup
│       │       ├── scss         # page secondary scss
│       │       ├── index.js     # controller
│       │       ├── index.pug    # view
│       │       └── index.scss   # styles
│       ├── styles         # global styles
│       │   ├── ui            # ui elements
│       │   └── **            # other style groups
│       ├── components.js  # requires components
│       ├── localizations.js  # requires localizations
│       └── routes.js      # defines routes
├── test          # tests
└── tmp           # temporary user folder (ignored by git)
```

## Localizations

The application supports multilanguage interfaces.

```
./src/config/localization.config.json  # settings (default language, etc.)
./src/kernel/Localization.class.js     # main localization class
./src/local/localization/??.json       # all language data files
./src/local/localizations.js           # requires language data files
```

Each language should have its own .json file, which is automatically required in the localization module (`localizations.js`). Each phrase has a `namespace` and a `key`. This pairs should be unique per language file.

## Routes

All routes (pages) are accepted by patterns, which are formed with paths and params. Paths are static, params are variable and not empty. E.g. a pattern `/package/:id` could accept routes `/package/e564wi` or `/package/3245rtfde454e`, but not `/package/`.

A pattern may look like `/path/path/:param/path/:param/path`. It means if we request `/path/path/2/path/4/path`, the router finds our pattern, gets all parameters `[2, 4]` and sends them to the page renderer process.

To prevent an unexpected redirects always type a full path begins with a slash `/`, e.g.:

```html
<a href="/route/page">Link</a>
```

### New route

Let's create a new route with a path `/element/:element-type/:element-name/view`.

```
.routes
└── element
   └── element-type
      └── element-name
         └── view
            ├── js         # secondary js (optional) - additional js files for the controller
            ├── pug        # secondary pug (optional) - additional pug files for the markup
            ├── scss       # secondary scss (optional) - additional mixins, etc.
            ├── index.js   # controller (required)
            ├── index.pug  # markup (optional) - required in the controller
            └── index.scss # styles (optional) - required in the controller
```

Then you need to declare a new route in `./src/local/routes.js`. A key is used as a regular expression to match a requested page, a value is a page controller's exported function which runs immediately.

```javascript
module.exports = {
   '/element/:element-type/:element-name/view': require('Routes/element/element-type/element-name/view')(),
};
```

The controller is a class extends the Page template (`./src/kernel/Page.class.js`) wrapped into an object structure with its configuration (see other page as examples). A minimal controller code is:

```javascript
const Page = require('Kernel/Page.class');

class Index extends Page {
   constructor(args, config) {
      super(args, config);
   }
}

module.exports = (config = {}) => ({
   config,
   Page: Index,
});
```

To add a stylesheet require it explicitly:

```javascript
require('./index.scss');
```

To define a template (instead of the default one) you need to create a `index.pug` file and redefine the `__render()` method:

```javascript
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
}

module.exports = (config = {}) => ({
   config,
   Page: Index,
});
```

The `__render()` method is one of the auto run methods which are called in the specific order during a process of page loading.

```javascript
class Index extends Page {
   async __ajaxData() {
      // Purpose: load all initial data from the server
   }

   async __render() {
      // Purpose: render a markup
   }

   __handlers() {
      // Purpose: add some js events
   }
}
```

## Components

Within pages may exist elements (components) that are used more than once, but with different texts etc., e.g. buttons, tiles, even whole templates (e.g. error pages). They are defined in `./src/local/components/**` and auto-loaded into all page classes.

`components.js` assumes the existence of `index.pug` file(s), the path of their parent folders joined with `.` will be used as a unique id of the component.

All `index.scss` files are required recursively.

Example of `newComponent` component:

```shell
.src/local/components/
└── groupOfComponents
   └── newComponent
      ├── images           # images, required in scss files (optional)
      ├── scss             # styles, required in index.scss (optional)
      ├── index.pug        # template file (required)
      └── index.scss       # scss file (optional)
```

Pages may use this component in their renderer process:

```javascript
const partOfHTML = this.getComponent()['groupOfComponents.newComponent']({
   _lang: this._getLocalization(),
   _data: {
      optionalVariable: 'value',
   },
});
```

The result may be send as a variable to some template.

## Modules

Modules (`./src/kernel/modules`) are classes or interfaces that can be required within the whole app.

```javascript
const module = require('Modules/name.module');
```

### Notifications

Library: [Noty](https://ned.im/noty/#/).

```javascript
const Noty = require('Modules/notifications.module');

// Types: [alert, error, warning, info (information), success]
new Noty({
   type: 'error',
   text: 'Notification example!',
   timeout: 1000,
}).show();
```

### Application logger

Library: [winston](https://github.com/winstonjs/winston), [winston-daily-rotate-file](https://github.com/winstonjs/winston-daily-rotate-file)

```javascript
const log = require('Modules/logger.app.module');

log.error('Error message.');
log.warn('Warning message.');
log.info('Info message.');
log.trace('Trace message.');
log.debug('Debug message.');
```

### Other

Full description and examples you can find in `./src/kernel/modules/**.js`.

## Testing

[Mocha](https://mochajs.org) is used as an environment and [chai](http://www.chaijs.com) as an assertion library. Tests have their own folder (`./test`) and are divided into 2 groups: api test (aren't connected with the current implementation) and application test (unit tests, etc.).

```shell
yarn mocha:all          # run all tests
yarn mocha:api          # run only API tests
yarn mocha:application  # run only app tests
```

## API requests

There are 3 main places from which we can call an API request - Router, Page rendering process and Page itself.

The default structure of handling responses from the server is `(CALL)─(API-MODULE)─(CONNECT)` where individual nodes are:

-  `CONNECT`
   -  `./src/kernel/modules/connect.module.js`
   -  provides different types of `fetch` with user token and other necessary data (an interface of getJSON, postJSON, etc.)
   -  handles global errors (without redirections)
-  `API-MODULE`
   -  `./src/kernel/modules/api/*.module.js`
   -  provides an API interface for logical groups of request
   -  handles individual save/remove events (without redirects)
-  `CALL`
   -  `evodoc.getAPI().getModule().method({...options})`
   -  a request in a `try-catch` block
   -  the `catch` section handles all redirects (e.g. a redirect after unauthorised error) and individual behavior (e.g. a notification about wrong password)

An API call visualisation:

```
.Router
   ├─(CALL)─(API-MODULE)─(CONNECT) (1)
   └─ Page rendering
      └─(CALL)─(API-MODULE)─(CONNECT) (2)

.Page
   └─(CALL)─(API-MODULE)─(CONNECT) (3)
```

Detailed communication:

```
(1) Router call <- (return|throw) <- Module <- (return|throw) <- Connect
(2) Router <- (throw) <- Page rendering call <- (return|throw) <- Module <- (return|throw) <- Connect
(3) Page call <- (return|throw) <- Module <- (return|throw) <- Connect
```

### Custom Response codes

1000 - No internet connection

### API call example

```js
// Modules
const connect = require('Modules/connect.module');
const errorAuth = require('Modules/api/auth.error');

try {
   // Call
   await evodoc
      .getAPI()
      .getAuth()
      .signIn({...});

   // Redirect
   evodoc.getRouter().load("/");
} catch (e) {
   // Error handling
   if (e instanceof errorAuth.InvalidAuthDataError) {
      new Noty({
         text: 'Login or password is invalid.',
      }).show();
      return;
   }

   connect.processOtherErrors(e);
}
```
