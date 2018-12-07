const log = require('Modules/logger.app.module');
const loader = require('Modules/loader.module');
const error = require('Modules/error.module');
// const errorConnect = require('Modules/error.module');

const configRouter = require('Configs/router.config');
const components = require('Local/components');
const templateDefault = require('Src/index.default.pug');
const sidebarButton = require('Components/sidebar-button/index.pug');

class Page {
   /**
    * @summary Abstract class for routes
    * @description Defines a basic interface for rendering, etc. for each route.
    * @class
    *
    * @param {object} args - Arguments from the URL:
    *    [0] - full path (/example/param1/param2)
    *    [1..*] - parameters (param1)
    * @param {object} config - Page config
    *
    * @returns {Page} Page instance
    */
   constructor(args, config = {}) {
      // Global
      this._args = args;
      this._config = Object.assign({}, configRouter.routeDefaultConfig, config);
      this._components = null;
      this._templateDefault = null;

      // Unique (redefine in instances)
      this._template = null;
      this._ajaxData = null;

      this._sidebarButtons = [];

      this.init();
   }

   // ----------------------------------------------------------------------------------------------
   // Public functions
   // ----------------------------------------------------------------------------------------------

   init() {
      log.trace(`Page [CREATING]: ${this._args[0]}`);

      this._components = components;
      this._templateDefault = templateDefault;
   }

   /**
    * @summary Loads the page
    * @description Automatically runs methods with double __ (each page overrides them).
    */
   async load() {
      loader.show();
      log.trace(`Page [LOADING]: ${this._args[0]}`);

      // Data process
      try {
         await this.__ajaxData();
      } catch (e) {
         // All redirect were already triggered in Page.class, just stop loading
         log.trace(`Page [FAILURE AJAX]: ${this._args[0]}`);
         throw new error.RenderError(this._args[0]);
      }

      // Render process
      try {
         await this.__render();
      } catch (e) {
         log.trace(`Page [FAILURE RENDER]: ${this._args[0]}`);
         loader.hide();
         log.error(e.message);
         throw new error.RenderError(this._args[0]);
      }

      this.__sidebarRemove();
      this.__sidebarUpdate();

      // Handlers
      this.__handlers();

      log.trace(`Page [SUCCESS]: ${this._args[0]}`);
      loader.hide();
   }

   // ----------------------------------------------------------------------------------------------
   // Private auto running fuctions (see this.load();). Should be overrided at pages.
   // ----------------------------------------------------------------------------------------------

   /**
    * @summary todo
    * @description Asynchronous function. May throw PageRenderError.
    *
    * @example <caption>Throw an PageRenderError.</caption>
    * throw new error.PageRenderError()
    */
   async __render() {
      log.warn('Page: Rendering process __render is default.');
      this._getRenderParent().innerHTML = this._templateDefault({
         _data: {
            requestedUrl: JSON.stringify(this._getRouteUrl(), null, '  '),
            args: JSON.stringify(this._getArgs(), null, '  '),
            localization: JSON.stringify(this._getLocalization(), null, '  '),
         },
         routes: Object.keys(evodoc.getRouter()._routeCollector),
      });
   }

   async __ajaxData() {
      log.warn('Page: Ajax process __ajaxData is default.');
   }

   /**
    * @summary Define all user events for elements.
    * @description Synchronous function. Run after the __render async function.
    *
    * @example <caption>Function example</caption>
    * document.getElementById("sign-in").addEventListener("click", () => {
    *    this._sendAuthorizationForm();
    * });
    */
   __handlers() {
      log.warn('Page: Handlering process __handlers is default.');
   }


   __sidebarRemove() {
      document.querySelector('.sidebar_right .sidebar__buttons').innerHTML = '';
   }

   __sidebarUpdate() {
      const container = document.querySelector('.sidebar_right .sidebar__buttons');
      this._sidebarButtons.forEach((element) => {
         container.innerHTML += sidebarButton({
            link: element.link || '/error/404',
            icon: element.icon || 'question',
            name: element.name || 'unknown',
         });
      });
   }

   // ----------------------------------------------------------------------------------------------
   // Private functions
   // ----------------------------------------------------------------------------------------------

   _getRenderParent() {
      return document.getElementById(this._config.rendering.main);
   }

   _getComponent() {
      return this._components;
   }

   _getLocalization() {
      return evodoc.getLocalization().getPhraseGroup('');
   }

   _getArgs() {
      return this._args;
   }

   _getRouteUrl() {
      return this._args[0];
   }
}

module.exports = Page;
