// Modules
const Noty = require('noty');
const Page = require('Kernel/Page.class');
const validator = require('Modules/validation.module');
const connect = require('Modules/connect.module');

// Errors
const errorAuth = require('Modules/api/auth.error');

// Files
require('./index.scss');
const template = require('./index.pug');


class Index extends Page {
   constructor(args, config) {
      super(args, config);
      this._template = template;
   }

   __render() {
      this._getRenderParent().innerHTML = this._template();
   }

   __ajaxData() {}

   __handlers() {
      document.getElementById('authorization__form_signup').addEventListener('submit', (e) => {
         e.preventDefault();
         if (
            this._usernameValidation()
            && this._emailValidation()
            && this._passwordValidation()
         ) {
            new Noty({
               type: 'success',
               timeout: 1000,
               text: 'Form submitted.',
            }).show();

            this._sendSignUp();
         }
      });
   }


   async _sendSignUp() {
      const password = document.getElementById('authorization__signup_password').value;
      const email = document.getElementById('authorization__signup_email').value;
      const username = document.getElementById('authorization__signup_username').value;


      if (
         !this._usernameValidation(username)
         || !this._passwordValidation(password)
         || !this._emailValidation(email)
      ) { return; }


      try {
         await evodoc
            .getAPI()
            .getAuth()
            .signUp(username, email, password);
         evodoc.getRouter().load('/');
      } catch (e) {
         if (e instanceof errorAuth.InvalidAuthDataError) {
            if (e.body.invalid.indexOf('username')) {
               new Noty({
                  type: 'error',
                  timeout: 7000,
                  text: 'Username is invalid or non-unique.',
               }).show();
            }

            if (e.body.invalid.indexOf('email')) {
               new Noty({
                  type: 'error',
                  timeout: 7000,
                  text: 'Email is invalid or non-unique.',
               }).show();
            }

            if (e.body.invalid.indexOf('password')) {
               new Noty({
                  type: 'error',
                  timeout: 7000,
                  text: 'Password is invalid.',
               }).show();
            }

            return;
         }

         connect.processOtherErrors(e);
      }
   }

   _passwordValidation() {
      const password = document.getElementById('authorization__signup_password').value;

      if (!validator.password(password)) {
         new Noty({
            type: 'error',
            timeout: 7000,
            text: 'The password is invalid. It shoud contain at least 1 lowercase, 1 uppercase, 1 number, 1 of !@#$%^&* symbols.',
         }).show();
         return false;
      }

      return true;
   }

   _emailValidation() {
      const email = document.getElementById('authorization__signup_email').value;
      if (!validator.email(email)) {
         new Noty({
            type: 'error',
            timeout: 7000,
            text: 'The e-mail is invalid.',
         }).show();
         return false;
      }

      return true;
   }

   _usernameValidation() {
      const username = document.getElementById('authorization__signup_username').value;
      if (!validator.username(username)) {
         new Noty({
            type: 'error',
            timeout: 7000,
            text: 'The username is invalid. It may contain only a-Z, numbers and symbols -_.',
         }).show();
         return false;
      }

      return true;
   }
}

module.exports = (config = {}) => ({
   config,
   Page: Index,
});
