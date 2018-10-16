/**
 * Loader - globally required modul via webpack. Reserves `loader` as a global variable.
 * Provides an interface of loader screen.
 * @module Loader
 *
 * @example <caption>Show & Hide</caption>
 * loader.show();
 * // some long-time actions
 * loader.hide();
 */

const loader = document.getElementById('loader');

/**
 * @summary Show loader
 * @description Show loader prevents user to click. E.g. during ajax requests.
 */
module.exports.show = () => {
   loader.setAttribute('class', 'loader_visible');
};

/**
 * @summary Hide loader
 * @description Hide loader.
 */
module.exports.hide = () => {
   loader.setAttribute('class', 'loader_hidden');
};
