// Stylesheet
require('./index.scss');

const Noty = require('noty');
const Page = require('Kernel/Page.class');
const connect = require('Modules/connect.module');
const errorConnect = require('Modules/connect.error');
const template = require('./index.pug');


class Index extends Page {
   constructor(args, config) {
      super(args, config);
      this._template = template;
   }

   async __ajaxData() {
      await connect.ajaxRequest(
         async () => {
            // Multiple request
            await Promise.all([
               evodoc.getAPI().getUserPrivate().getOwnAccount(),
            ]).then((values) => {
               [
                  this._getOwnAccount,
               ] = values;
            });
         },
         (err) => {
            // Solving local errors
            if (err instanceof errorConnect.InvalidDataError) {
               evodoc.getRouter().load('/error/404');
               return;
            }
            throw err;
         },
      ).catch((err) => {
         // Everything is resolved, placeholder PropagationCancel
         // Need to stop renderings this page
         throw err;
      });
   }

   __render() {
      this._getRenderParent().innerHTML = this._template({
         username: this._getOwnAccount.body.username,
         email: this._getOwnAccount.body.email,
         name: this._getOwnAccount.body.name
            ? this._getOwnAccount.body.name
            : this._getOwnAccount.body.username,
      });
   }


   __handlers() {
      document.querySelector('#accountChangeData').addEventListener('submit', (evt) => {
         evt.preventDefault();
         this.editOwnAccount();
      });

      document.querySelector('#accountChangePassword').addEventListener('submit', (evt) => {
         evt.preventDefault();
         this.changePassword();
      });
   }


   /**
    * @summary Change account information
    */
   async editOwnAccount() {
      const name = document.querySelector('#name').value;
      const username = document.querySelector('#username').value;
      const email = document.querySelector('#email').value;

      const data = {};

      if (name !== this._getOwnAccount.body.name) {
         data.name = name;
      }

      if (username !== this._getOwnAccount.body.username) {
         data.username = username;
      }

      if (email !== this._getOwnAccount.body.email) {
         data.email = email;
      }


      await connect.ajaxRequest(
         async () => {
            await evodoc.getAPI().getUserPrivate().editOwnAccount(data);
            new Noty({
               text: 'Account data were changed.',
               type: 'success',
               timeout: 5000,
            }).show();
         },
         (err) => {
            // Error handling
            if (err instanceof errorConnect.InvalidDataError) {
               // Wrong username
               if (err.body.invalid.indexOf('username') >= 0) {
                  new Noty({
                     text: 'The username is already taken.',
                     type: 'warning',
                     timeout: 5000,
                  }).show();
               }
               // Wrong email
               if (err.body.invalid.indexOf('email') >= 0) {
                  new Noty({
                     text: 'The email is invalid or already registered.',
                     type: 'warning',
                     timeout: 5000,
                  }).show();
               }
               return;
            }

            throw err;
         },
      );
   }


   /**
    * @summary Change password
    */
   async changePassword() {
      const oldPass = document.getElementById('oldPass').value;
      const newPass = document.getElementById('newPass').value;
      const newPassRepeat = document.getElementById('newPassRepeat').value;

      if (newPass !== newPassRepeat) {
         new Noty({
            text: 'New passwords are different.',
            type: 'warning',
            timeout: 5000,
         }).show();
         return;
      }

      await connect.ajaxRequest(
         async () => {
            await evodoc.getAPI().getUserPrivate().changePassword(oldPass, newPass);
         },
         (err) => {
            // Error handling
            if (err instanceof errorConnect.InvalidDataError) {
               // Wrong username
               if (err.body.invalid.indexOf('new_password') >= 0) {
                  new Noty({
                     text: 'Your new password is too weak.',
                     type: 'warning',
                     timeout: 5000,
                  }).show();
               }
               // Wrong email
               if (err.body.invalid.indexOf('old_password') >= 0) {
                  new Noty({
                     text: 'Your current password is different.',
                     type: 'error',
                     timeout: 5000,
                  }).show();
               }
               return;
            }

            throw err;
         },
      );
   }
}

module.exports = (config = {}) => ({
   config,
   Page: Index,
});
