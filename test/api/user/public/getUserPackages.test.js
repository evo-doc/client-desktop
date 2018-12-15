const chai = require('chai');
const chaiHttp = require('chai-http');

// const { expect } = chai;
chai.use(chaiHttp);

// -------------------------------------------------------------------------------------------------
// Test
// -------------------------------------------------------------------------------------------------

module.exports = (config, request, utility) => {
   describe('Get user packages', () => {
      const account = {
         username: utility.string(10),
         email() { return `${this.username}@example.com`; },
         password: `aA#2${utility.string(10)}`,
         token: null,
      };

      before('Account creation', () => utility.hooks.createAccount(account)
         .then((token) => {
            account.token = token;
         }));

      after('Account destruction', () => utility.hooks.removeAccount(account));

      // -------------------------------------------------------------------------------------------
      // Valid
      // -------------------------------------------------------------------------------------------

      context('Invalid', () => { });

      // -------------------------------------------------------------------------------------------
      // Invalid
      // -------------------------------------------------------------------------------------------

      context('Valid', () => { });
   });
};
