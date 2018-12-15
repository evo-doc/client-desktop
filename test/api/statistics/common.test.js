const chai = require('chai');
const chaiHttp = require('chai-http');

const { expect } = chai;
chai.use(chaiHttp);

// -------------------------------------------------------------------------------------------------
// Test
// -------------------------------------------------------------------------------------------------

module.exports = (config, request, utility) => {
   describe('Common', () => {
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

      // ----------------------------------------------------------------------------------------
      // Valid
      // ----------------------------------------------------------------------------------------

      context('Valid', () => {
         it('expects 200', () => request.statistics.common(account.token)
            .then((res) => {
               expect(res).to.have.status(200);
               expect(res).to.have.header('content-type', 'application/json');
               expect(res.body).to.be.an('object');
               expect(res.body).to.have.all.keys('users', 'packages', 'projects');
            })
            .catch((err) => {
               throw err;
            }));
      });
   });
};
