const chai = require('chai');
const chaiHttp = require('chai-http');

const { expect } = chai;
chai.use(chaiHttp);

// -------------------------------------------------------------------------------------------------
// Test
// -------------------------------------------------------------------------------------------------

module.exports = (config, request, utility) => {
   describe('Get all users', () => {
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

      context('Invalid', () => {

      });

      // -------------------------------------------------------------------------------------------
      // Invalid
      // -------------------------------------------------------------------------------------------

      context('Valid', () => {
         it('expects 200', () => request.user.getAllUsers(account.token)
            .then((res) => {
               expect(res).to.have.status(200);
               expect(res).to.have.header('content-type', 'application/json');
               expect(res.body).to.be.an('object');
               expect(res.body).to.have.all.keys('users');
               expect(res.body.users).to.have.all.keys('label', 'data');
               expect(res.body.users.label).to.be.an('array');
               expect(res.body.users.data).to.be.an('array');

               expect(res.body.users.data.length).to.be.above(0);
               expect(res.body.users.label.length).to.equal(res.body.users.data[0].length);

               expect(res.body.users.label).to.contain('username');
            }));
      });
   });
};
