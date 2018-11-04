// Stylesheet
require('./index.scss');

const Noty = require('noty');
const Page = require('Kernel/Page.class');
const validator = require('Modules/validation.module');
const error = require('Modules/error.module');
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
      document.getElementById('authorization__form_signin').addEventListener('submit', (evt) => {
         evt.preventDefault();
         this._sendSignIn();
      });

      // authorization__form_signin-login
      // authorization__form_signin-password
   }

   async _sendSignIn() {
      const login = document.getElementById('authorization__signin_login').value;
      const password = document.getElementById('authorization__signin_password').value;

      if (
         !this._loginValidation(login)
         || !this._passwordValidator(password)
      ) { return; }


      try {
         await evodoc
            .getAPI()
            .getAuth()
            .signIn(login, password);
      } catch (e) {
         // Personal errors
         // ----------------------------------------------------------------------------------------
         if (e instanceof error.AuthorizationError) {
            new Noty({
               type: 'warning',
               timeout: 7000,
               text: 'Username or password is invalid.',
            }).show();
         }

         // Global errors
         // ----------------------------------------------------------------------------------------
         // if (e instanceof error.RequestError) return;
      }
   }


   _passwordValidator(password) {
      if (!validator.password(password)) {
         new Noty({
            type: 'error',
            timeout: 7000,
            text: 'The password is invalid.',
         }).show();
         return false;
      }

      return true;
   }

   _loginValidation(login) {
      if (!validator.email(login) && !validator.username(login)) {
         new Noty({
            type: 'error',
            timeout: 7000,
            text: 'The login should be username/e-mail.',
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
