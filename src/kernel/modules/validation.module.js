/**
 * @summary Provides an interface for validation
 * @module Validation
 * @example <caption> How to include validation module </caption>
 * const validation = require("Modules/validation.module")
 */

/**
 * @description Determine whether email is valid.
 * @param {string} email - Users email
 * @return {boolean} - Email is valid
 */
module.exports.email = (email) => {
   const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
   return re.test(email.toLowerCase());
};

/**
 * @description Determine whether password is valid.
 * @param {string} pass - Users password
 * @return {boolean} - Password is valid
 */
module.exports.password = (password) => {
   const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/;
   return re.test(password);
};

/**
 * @description Determine whether username is valid.
 * @param {string} username - Users username
 * @return {boolean} - Username is valid
 */
module.exports.username = (username) => {
   const re = /^[a-zA-Z0-9\-_]+$/;
   return re.test(username);
};
