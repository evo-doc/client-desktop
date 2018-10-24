module.exports = {
   authFree: [
      // Sign In, Sign Up, ...
      /^\/auth\/(signin|signup)$/,
      // Error pages
      /^\/error\/\d{3}/,
      /^\/default$/,
   ],
   routeDefaultConfig: {
      // IDs of parent rendering elements
      rendering: {
         main: 'render_main',
      },
   },
};
