// Modules
const log = require('Modules/logger.app.module');
const error = require('Modules/error.module');

// Error objects
const errorConnect = require('Modules/connect.error');

// Other dependencies
const configRouter = require('Configs/router.config.js');
const routeCollector = require('Local/routes');


class Router {
   /**
    * @summary Client side routing
    * @description Receive URL from ***Request*** module, check if the requested URL is suitable for
    * some available URL, parse *paths* and *params* and run init() of the page
    * @class
    *
    * @returns {Request} Request instance
    */
   constructor() {
      this._routeCollector = {};
      this._routes = [];
      this._current = null;
      this._baseUrl = '';
   }

   init() {
      //
      [this._baseUrl] = window.location.href.split('#');

      // Load all page generators
      this._routeCollector = routeCollector;

      // Create routes
      log.debug('Router: add routes');

      const routePaths = Object.keys(this._routeCollector);

      for (let i = 0; i < routePaths.length; i++) {
         const pagePath = routePaths[i];
         const page = this._routeCollector[pagePath];


         this._routes.push({
            pattern: new RegExp(`^${pagePath.replace(/:\w+/g, '([\\w-]+)')}$`),
            generator: page,
         });

         log.trace(`Router [ADDED]: Route "${pagePath}"`);
      }
      log.debug('Router: add routes');

      this._startListening();
   }

   /**
    * @summary Load requested page
    * @description Load page after user click (windows.location.href is already changed).
    *
    * @param {string} link - Route link
    *
    * @example
    * APP.getRequest().load("/registry/package/awesome");
    */
   load(link) {
      window.location.href = `${this._baseUrl}#${link}`;
      this.route(link);
   }

   /**
    * @summary Refresh current page
    * @description Get the current url and refresh page.
    *
    * @example
    * APP.getRequest().refresh();
    */
   refresh() {
      this.load(this._getCurrentUrl());
   }

   /**
    * @summary Redirect page to specific url
    * @description Simulate user click on link, change window.location.href and load a route.
    *
    * @param {string} link - Route link
    *
    * @example
    * APP.getRequest().redirect("/registry/package/awesome");
    */
   redirect(link) {
      window.location.href = `${this._baseUrl}#${link}`;
      this.load(link);
   }

   /**
    * @summary Start listen user clicks on <a> tags
    * @description Listens user click to let Router k§now that we need another page
    * @private
    */
   _startListening() {
      const self = this;
      /*
      let root = document.getElementById("root");
      // Link Autofixer
      root.addEventListener("mousemove", function(e) {
         if (e.target.tagName === "A" && e.target.getAttribute("href").indexOf("#") !== 0)
            e.target.setAttribute("href", `#${e.target.getAttribute("href")}`);
      });
      */

      document.addEventListener('click', (e) => {
         const closest = e.target.closest('a');
         if (closest) {
            e.preventDefault();
            log.trace('Event: Click A');
            const href = closest.getAttribute('href');
            self.load(href);
         }
      });
   }

   /**
    * @summary Get current page link
    * @description Parse window.location.href and get current route link
    * @private
    *
    * @returns {string} Route link
    */
   _getCurrentUrl() {
      return window.location.href.split('#')[1] || '/';
   }


   /**
    * @summary Search requested path and load suitable page (or 404)
    * @description Gets requested path and checks all route patterns via regex.
    *
    * @param {string} path
    */
   async route(path) {
      log.debug('Route Process');
      log.trace(`Router: Searching for ${path}`);

      // Try fo find route
      let page;
      try {
         log.trace(`Router: Trying to find route ${path}`);
         page = this._findRoute(path); // Has page index in roures and args from URL
      } catch (e) {
         log.trace(`Router: Page ${path} does not exist`);
         log.debug('Route Process');
         this.load('/error/404');
         return; // Page does not exist
      }

      // If the page is not auth free -> check auth
      if (!this._isAuthFreePage(path)) {
         log.trace(`Page "${path}" requires an authorisation.`);
         try {
            await evodoc.getAPI()
               .getAuth()
               .isAuthenticated();
         } catch (e) {
            if (e instanceof errorConnect.ResponseError) {
               this.route(`/error/${e.code}`);
               return;
            }
            if (e instanceof errorConnect.UnexpectedError) {
               this.route('/error/666');
               return;
            }

            log.error('Impossible router error');
            this.route('/error/999');
            return;
         }
      } else {
         log.trace(`Router: Page ${path} is auth free`);
      }


      log.debug('Page creation');
      // Create page instance with its config & args
      log.trace('Router: Creating new page instance from its generator');
      this._current = new this._routes[page.i].generator.Page(
         page.args,
         this._routes[page.i].generator.config,
      );

      // Load page
      try {
         log.trace('Router: load() page');
         await this._current.load();
      } catch (e) {
         log.trace('Router: load() page crashed');
         // Stop routing, error from load called new redirect
      }
      log.debug('Page creation end');

      log.debug('Route Process end');
   }

   /**
    * @summary Find route
    * @description Try to find requested route and return it's index in routes
    * + parsed arguments from the URL.
    * @private
    *
    * @param {string} path - Requested page path
    * @returns {object} - Object with page index and arguments from the URL
    */
   _findRoute(path) {
      let args;
      let i = this._routes.length;
      while (i--) {
         args = path.match(this._routes[i].pattern);
         if (args) return { i, args };
      }
      log.error(`Router [SEARCH]: ${path} does not exist`);
      throw new error.PageNotFoundError(path);
   }

   /**
    * @summary Is page authFree?
    * @description Check if the requested page requires authentificated used.
    * @private
    *
    * @param {string} path - Requested page path
    * @returns {boolean}
    */
   _isAuthFreePage(path) {
      let isFree = false;
      configRouter.authFree.forEach((pattern) => {
         if (path.match(pattern)) isFree = true;
      });
      return isFree;
   }
}

module.exports = Router;
