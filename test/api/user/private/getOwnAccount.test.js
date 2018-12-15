const chai = require('chai');
const chaiHttp = require('chai-http');
const crypto = require('crypto');

const { expect } = chai;
chai.use(chaiHttp);

// -------------------------------------------------------------------------------------------------
// Test
// -------------------------------------------------------------------------------------------------

module.exports = (config, request, utility) => {
   describe('Get own account', () => {
      const account = {
         username: utility.string(10),
         email() { return `${this.username}@example.com`; },
         avatar() {
            return crypto.createHash('md5').update(this.email().toLowerCase()).digest('hex');
         },
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

      context('Invalid', () => {

      });

      // -------------------------------------------------------------------------------------------
      // Invalid
      // -------------------------------------------------------------------------------------------

      context('Valid', () => {
         it('expects 200', () => request.user.getUserAccount(account.username, account.token)
            .then((res) => {
               expect(res).to.have.status(200);
               expect(res).to.have.header('content-type', 'application/json');

               expect(res.body).to.be.an('object');
               expect(res.body).to.have.all.keys('username', 'email', 'avatar', 'name');

               expect(res.body.username).to.equal(account.username);
               expect(res.body.email).to.equal(account.email());
               expect(res.body.avatar).to.equal(account.avatar());
            }));
      });
   });
};
