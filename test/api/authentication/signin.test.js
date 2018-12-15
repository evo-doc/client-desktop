const chai = require('chai');
const chaiHttp = require('chai-http');

const { expect } = chai;
chai.use(chaiHttp);

// -------------------------------------------------------------------------------------------------
// Test
// -------------------------------------------------------------------------------------------------

module.exports = (config, request, utility) => {
   const url = {
      singin: '/auth/signin',
   };


   describe('Sign In', () => {
      // ----------------------------------------------------------------------------------------
      // Invalid
      // ----------------------------------------------------------------------------------------

      context('Invalid', () => {
         it('expects 422 due to incorrect format (empty)', () => chai.request(config.host)
            .post(url.singin)
            .send()
            .then((res) => {
               expect(res).to.have.status(422);
            })
            .catch((err) => {
               throw err;
            }));

         it('expects 422 due to incorrect format (text)', () => chai.request(config.host)
            .post(url.singin)
            .send('text')
            .then((res) => {
               expect(res).to.have.status(422);
            })
            .catch((err) => {
               throw err;
            }));

         it('expects 422 due to incorrect format (invalid json)', () => chai.request(config.host)
            .post(url.singin)
            .send('{ login: "no"')
            .then((res) => {
               expect(res).to.have.status(422);
            })
            .catch((err) => {
               throw err;
            }));

         // -------------------------------------------------------------------------------------

         it('expects 422 due to missing login', () => chai.request(config.host)
            .post(url.singin)
            .send({ password: '654sfg753' })
            .then((res) => {
               expect(res).to.have.status(422);
            })
            .catch((err) => {
               throw err;
            }));


         it('expects 422 due to missing password', () => chai.request(config.host)
            .post(url.singin)
            .send({ login: 'example' })
            .then((res) => {
               expect(res).to.have.status(422);
            })
            .catch((err) => {
               throw err;
            }));

         // -------------------------------------------------------------------------------------

         it('expects 400 due to wrong username or password', () => {
            const login = utility.string(10);
            const password = utility.string(12);

            return request.auth.signin(login, password)
               .then((res) => {
                  expect(res).to.have.status(400);
                  expect(res).to.have.header('content-type', 'application/json');
                  expect(res.body).to.be.an('object');
                  expect(res.body).to.have.property('invalid');
                  expect(res.body.invalid).to.be.an('array');
                  expect(res.body.invalid).to.be.empty;
               })
               .catch((err) => {
                  throw err;
               });
         });
      });


      // ----------------------------------------------------------------------------------------
      // Valid
      // ----------------------------------------------------------------------------------------

      context('Valid', () => {
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

         // -------------------------------------------------------------------------------------

         it('uses username and expects 200 and token + username',
            () => request.auth.signin(account.username, account.password)
               .then((res) => {
                  expect(res).to.have.status(200);
                  expect(res).to.have.header('content-type', 'application/json');
                  expect(res.body).to.be.an('object');
                  expect(res.body).to.have.all.keys('token', 'username');
                  expect(res.body.token).to.be.a('string');
                  expect(res.body.username).to.be.a('string').to.equal(account.username);
                  account.token = res.body.token;
               })
               .catch((err) => {
                  throw err;
               }));


         it('uses email and expects 200 and token + username',
            () => request.auth.signin(account.email(), account.password)
               .then((res) => {
                  expect(res).to.have.status(200);
                  expect(res).to.have.header('content-type', 'application/json');
                  expect(res.body).to.be.an('object');
                  expect(res.body).to.have.all.keys('token', 'username');
                  expect(res.body.token).to.be.a('string');
                  expect(res.body.username).to.be.a('string').to.equal(account.username);
                  account.token = res.body.token;
               })
               .catch((err) => {
                  throw err;
               }));
      });
   });
};
