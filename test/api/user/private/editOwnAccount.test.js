const chai = require('chai');
const chaiHttp = require('chai-http');
const crypto = require('crypto');

const { expect } = chai;
chai.use(chaiHttp);

// -------------------------------------------------------------------------------------------------
// Test
// -------------------------------------------------------------------------------------------------

module.exports = (config, request, utility) => {
   describe('Patch own account', () => {
      const account = {
         username: utility.string(10),
         email() { return `${this.username}@example.com`; },
         password: `aA#2${utility.string(10)}`,
         token: null,
      };

      const accountSecond = {
         username: utility.string(10),
         email() { return `${this.username}@example.com`; },
         password: `aA#2${utility.string(10)}`,
         name: 'Name User',
         token: null,
      };

      const accountPatched = {
         username: utility.string(10),
         name: 'Name User',
         email() { return `${this.username}@example.com`; },
         avatar() {
            return crypto.createHash('md5').update(this.email().toLowerCase()).digest('hex');
         },
      };

      before('Account creation', async () => {
         const account0 = utility.hooks.createAccount(account)
            .then((token) => {
               account.token = token;
            });

         const account1 = utility.hooks.createAccount(accountSecond)
            .then((token) => {
               accountSecond.token = token;
            });

         return Promise.all([account0, account1]);
      });


      after('Account destruction', () => Promise.all([
         utility.hooks.removeAccount(account),
         utility.hooks.removeAccount(accountSecond),
      ]));

      // -------------------------------------------------------------------------------------------
      // Valid
      // -------------------------------------------------------------------------------------------

      context('Invalid', () => {
         it('expects 400 because of non unique email', async () => {
            // Edit
            await request.user.editOwnAccount({
               email: accountSecond.email(),
               name: accountSecond.name,
            }, account.token)
               .then((res) => {
                  expect(res).to.have.status(400);

                  expect(res).to.have.header('content-type', 'application/json');

                  expect(res.body).to.be.an('object');
                  expect(res.body).to.have.all.keys('invalid', 'message');

                  expect(res.body.invalid).to.be.an('array');
                  expect(res.body.invalid).to.contain('email');
               });


            // Check
            await request.user.getUserAccount(account.username, account.token)
               .then((res) => {
                  expect(res).to.have.status(200);
                  expect(res).to.have.header('content-type', 'application/json');

                  expect(res.body).to.be.an('object');
                  expect(res.body).to.have.all.keys('username', 'email', 'avatar', 'name');

                  expect(res.body.username).to.equal(account.username);
                  expect(res.body.name).to.equal(null);
                  expect(res.body.email).to.equal(account.email());
               });
         });

         it('expects 400 because of non unique username', async () => {
            // Edit
            await request.user.editOwnAccount({
               username: accountSecond.username,
               name: accountSecond.name,
            }, account.token)
               .then((res) => {
                  expect(res).to.have.status(400);

                  expect(res).to.have.header('content-type', 'application/json');

                  expect(res.body).to.be.an('object');
                  expect(res.body).to.have.all.keys('invalid', 'message');
                  expect(res.body.invalid).to.be.an('array');
                  expect(res.body.invalid).to.contain('username');
               });


            // Check
            await request.user.getUserAccount(account.username, account.token)
               .then((res) => {
                  expect(res).to.have.status(200);
                  expect(res).to.have.header('content-type', 'application/json');

                  expect(res.body).to.be.an('object');
                  expect(res.body).to.have.all.keys('username', 'email', 'avatar', 'name');

                  expect(res.body.username).to.equal(account.username);
                  expect(res.body.name).to.equal(null);
                  expect(res.body.email).to.equal(account.email());
               });
         });
      });

      // -------------------------------------------------------------------------------------------
      // Invalid
      // -------------------------------------------------------------------------------------------

      context('Valid', () => {
         it('expects 200', async () => {
            // Edit
            await request.user.editOwnAccount({
               username: accountPatched.username,
               name: accountPatched.name,
               email: accountPatched.email(),
            }, account.token)
               .then((res) => {
                  expect(res).to.have.status(200);
               });

            // Check
            await request.user.getUserAccount(accountPatched.username, account.token)
               .then((res) => {
                  expect(res).to.have.status(200);
                  expect(res).to.have.header('content-type', 'application/json');

                  expect(res.body).to.be.an('object');
                  expect(res.body).to.have.all.keys('username', 'email', 'avatar', 'name');

                  expect(res.body.username).to.equal(accountPatched.username);
                  expect(res.body.name).to.equal(accountPatched.name);
                  expect(res.body.email).to.equal(accountPatched.email());
                  expect(res.body.avatar).to.equal(accountPatched.avatar());
               });
         });
      });
   });
};
