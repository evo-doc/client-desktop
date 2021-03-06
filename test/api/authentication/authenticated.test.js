const chai = require('chai');
const chaiHttp = require('chai-http');

const { expect } = chai;
chai.use(chaiHttp);

// -------------------------------------------------------------------------------------------------
// Test
// -------------------------------------------------------------------------------------------------

module.exports = (config, request, utility) => {
   describe('Is Authenticated', () => {
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
      // Invalid
      // -------------------------------------------------------------------------------------------

      context('Invalid', () => {
         it('expects 401 due to invalid token', () => request.auth.authenticated(account.token.slice(-1))
            .then((res) => {
               expect(res).to.have.status(401);
               expect(res).to.have.header('content-type', 'application/json');
               expect(res.body).to.be.an('object');
               expect(res.body).to.have.all.keys('message', 'invalid');
               expect(res.body.invalid).to.be.an('array');
               expect(res.body.invalid).to.include('token');
            })
            .catch((err) => {
               throw err;
            }));

         it('expects 401 due to missing Authorization header', () => chai.request(config.host)
            .get('/auth/authenticated')
            .send()
            .then((res) => {
               expect(res).to.have.status(401);
            })
            .catch((err) => {
               throw err;
            }));
      });

      // -------------------------------------------------------------------------------------------
      // Valid
      // -------------------------------------------------------------------------------------------

      context('Valid', () => {
         it('expects 200', () => request.auth.authenticated(account.token)
            .then((res) => {
               expect(res).to.have.status(200);
               expect(res).to.have.header('content-type', 'application/json');
               expect(res.body).to.be.an('object');
               expect(res.body).to.have.all.keys('message');
            })
            .catch((err) => {
               throw err;
            }));
      });
   });
};
