const chai = require('chai');
const chaiHttp = require('chai-http');
const crypto = require('crypto');

const { expect } = chai;
chai.use(chaiHttp);

// -------------------------------------------------------------------------------------------------
// Test
// -------------------------------------------------------------------------------------------------

module.exports = (config, request, utility) => {
   describe('Change password', () => {
      const account = {
         username: utility.string(10),
         email() { return `${this.username}@example.com`; },
         avatar() {
            return crypto.createHash('md5').update(this.email().toLowerCase()).digest('hex');
         },
         password: `aA#2${utility.string(10)}`,
         passwordNew: `aA#2${utility.string(10)}`,
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
         it('expects 400 because of invalid old password', async () => {
            await request.user.changePassword({
               old_password: `${account.password}1`,
               new_password: account.passwordNew,
            }, account.token)
               .then((res) => {
                  expect(res).to.have.status(400);
                  expect(res).to.have.header('content-type', 'application/json');
                  expect(res.body).to.be.an('object');
                  expect(res.body).to.have.property('invalid');
                  expect(res.body.invalid).to.be.an('array');
                  expect(res.body.invalid).to.contain('old_password');
               });
         });

         it('expects 400 because of invalid new password', async () => {
            await request.user.changePassword({
               old_password: account.password,
               new_password: 'exampleinvalidpass',
            }, account.token)
               .then((res) => {
                  expect(res).to.have.status(400);
                  expect(res).to.have.header('content-type', 'application/json');
                  expect(res.body).to.be.an('object');
                  expect(res.body).to.have.property('invalid');
                  expect(res.body.invalid).to.be.an('array');
                  expect(res.body.invalid).to.contain('new_password');
               });
         });
      });

      // -------------------------------------------------------------------------------------------
      // Invalid
      // -------------------------------------------------------------------------------------------

      context('Valid', () => {
         it('expects 200', async () => {
            await request.user.changePassword({
               old_password: account.password,
               new_password: account.passwordNew,
            }, account.token)
               .then((res) => {
                  expect(res).to.have.status(200);
               });

            await request.auth.signin(account.email(), account.passwordNew)
               .then((res) => {
                  expect(res).to.have.status(200);
                  expect(res).to.have.header('content-type', 'application/json');
                  expect(res.body).to.be.an('object');
                  expect(res.body).to.have.all.keys('token', 'username');
                  expect(res.body.token).to.be.a('string');
                  expect(res.body.username).to.be.a('string').to.equal(account.username);
                  account.token = res.body.token;
               });
         });
      });
   });
};
