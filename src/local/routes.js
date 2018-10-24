/**
 * @file Defines all available pages (roots), their paths and options, which are used for their
 * initialization (e.g. where to render, etc.).
 *
 * "/group/page/:param/path/:param"
 *
 * @example <caption>Declaration of a page</caption>
 * "/login/default": require("routes/login/default")({
 *    root: "root"
 * }),
 */

module.exports = {
   // Default page
   '/default': require('Routes/default')(),

   // Homepage
   '/': require('Routes/homepage')(),

   // Authorization (access without token)
   '/auth/signin': require('Routes/auth/signin')(),
   '/auth/signup': require('Routes/auth/signup')(),

   // Profile
   '/profiles/:user': require('Routes/profiles/user')(),

   '/profile/view': require('Routes/profile/view')(),
   '/profile/edit': require('Routes/profile/edit')(),

   // Package
   '/packages/view': require('Routes/packages/view')(),
   '/packages/create': require('Routes/packages/create')(),

   '/package/:name/view': require('Routes/package/name/view')(),

   // Projects
   '/projects/view': require('Routes/projects/view')(),
   '/projects/create': require('Routes/projects/create')(),

   '/project/:name/view': require('Routes/project/name/view')(),
   '/project/:name/edit': require('Routes/project/name/edit')(),

   // Modules
   '/project/:name/modules/view': require('Routes/project/name/modules/view')(),
   '/project/:name/modules/create': require('Routes/project/name/modules/create')(),

   '/project/:name/module/:name/view': require('Routes/project/name/module/name/view')(),
   '/project/:name/module/:name/edit': require('Routes/project/name/module/name/edit')(),

   // Docs
   '/docs': require('Routes/docs')(),
   '/about': require('Routes/about')(),

   // Errors
   '/error/:code': require('Routes/error/default')(),
};
