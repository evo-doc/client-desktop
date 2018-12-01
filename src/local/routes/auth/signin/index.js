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
      document.getElementById('authorization__form_signin').addEventListener('submit', (evt) => {
         evt.preventDefault();
         this._sendSignIn();
      });
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
         evodoc.getRouter().load('/');
      } catch (e) {
         if (e instanceof errorAuth.InvalidAuthDataError) {
            new Noty({
               type: 'error',
               timeout: 7000,
               text: 'Login or password is invalid.',
            }).show();
            return;
         }

         connect.processOtherErrors(e);
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
