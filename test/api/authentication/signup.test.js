const chai = require('chai');
const chaiHttp = require('chai-http');

const { expect } = chai;
chai.use(chaiHttp);

// -------------------------------------------------------------------------------------------------
// Test
// -------------------------------------------------------------------------------------------------

module.exports = (config, request, utility) => {
   const url = {
      singup: '/auth/signup',
   };


   describe('Sign Up', () => {
      // ----------------------------------------------------------------------------------------
      // Invalid
      // ----------------------------------------------------------------------------------------

      context('Invalid', () => {
         it('expects 422 due to incorrect format (empty)', () => chai.request(config.host)
            .post(url.singup)
            .send()
            .then((res) => {
               expect(res).to.have.status(422);
            })
            .catch((err) => {
               throw err;
            }));

         // -------------------------------------------------------------------------------------

         it('expects 422 due to missing username', () => chai.request(config.host)
            .post(url.singup)
            .send({ password: '654sfg753', email: 'email@example.com' })
            .then((res) => {
               expect(res).to.have.status(422);
            })
            .catch((err) => {
               throw err;
            }));


         it('expects 422 due to missing email', () => chai.request(config.host)
            .post(url.singup)
            .send({ username: 'example', password: 'pass' })
            .then((res) => {
               expect(res).to.have.status(422);
            })
            .catch((err) => {
               throw err;
            }));


         it('expects 422 due to missing password', () => chai.request(config.host)
            .post(url.singup)
            .send({ username: 'example', email: 'email.example.com' })
            .then((res) => {
               expect(res).to.have.status(422);
            })
            .catch((err) => {
               throw err;
            }));

         // -------------------------------------------------------------------------------------

         [
            ['', 'empty'],
            ['sdfsd+asd45', 'contains invalid symbols: +'],
            ['/adfdsg', 'contains invalid symbols: /'],
            ['dsfgdf.dfdfg', 'contains invalid symbols: .'],
         ].forEach((item) => {
            it(`expects 400 due to invalid username (${item[1]})`, () => {
               const username = item[0];
               const email = '';
               const password = '';

               return request.auth.signup(username, email, password)
                  .then((res) => {
                     expect(res).to.have.status(400);
                     expect(res).to.have.header('content-type', 'application/json');
                     expect(res.body).to.be.an('object');
                     expect(res.body).to.have.property('invalid');
                     expect(res.body.invalid).to.be.an('array');
                     expect(res.body.invalid).contain('username');
                  })
                  .catch((err) => {
                     throw err;
                  });
            });
         });


         [
            ['', 'email'],
            ['/adfdsg.com', ''],
            ['@example.com', ''],
            ['dsfgdf@asd', ''],
            ['dsfgdf@.com', ''],
            ['dsfgdf.com', ''],
         ].forEach((item) => {
            it(`expects 400 due to invalid email (${item[0]}${item[1]})`, () => {
               const username = '';
               const email = item[0];
               const password = '';

               return request.auth.signup(username, email, password)
                  .then((res) => {
                     expect(res).to.have.status(400);
                     expect(res).to.have.header('content-type', 'application/json');
                     expect(res.body).to.be.an('object');
                     expect(res.body).to.have.property('invalid');
                     expect(res.body.invalid).to.be.an('array');
                     expect(res.body.invalid).contain('email');
                  })
                  .catch((err) => {
                     throw err;
                  });
            });
         });


         [
            ['', 'empty'],
            ['ABCD1234@', 'missing lowercase'],
            ['abcd1234@', 'missing uppercase'],
            ['abcdABCD@', 'missing number'],
            ['aB4@567', 'less than 8 symbols'],
         ].forEach((item) => {
            it(`expects 400 due to invalid password (${item[1]})`, () => {
               const username = '';
               const email = '';
               const password = item[0];

               return request.auth.signup(username, email, password)
                  .then((res) => {
                     expect(res).to.have.status(400);
                     expect(res).to.have.header('content-type', 'application/json');
                     expect(res.body).to.be.an('object');
                     expect(res.body).to.have.property('invalid');
                     expect(res.body.invalid).to.be.an('array');
                     expect(res.body.invalid).contain('password');
                  })
                  .catch((err) => {
                     throw err;
                  });
            });
         });
      });


      // ----------------------------------------------------------------------------------------
      // Non-Unique
      // ----------------------------------------------------------------------------------------

      context('Non-Unique', () => {
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

         it('expects 400 due to non-unique username', () => {
            const { username, password } = account;
            const email = `${utility.string(10)}@example.com`;

            return request.auth.signup(username, email, password)
               .then((res) => {
                  expect(res).to.have.status(400);
                  expect(res).to.have.header('content-type', 'application/json');
                  expect(res.body).to.be.an('object');
                  expect(res.body).to.have.property('invalid');
                  expect(res.body.invalid).to.be.an('array');
                  expect(res.body.invalid).contain('username');
               })
               .catch((err) => {
                  throw err;
               });
         });

         it('expects 400 due to non-unique email', () => {
            const username = utility.string(10);
            const email = account.email();
            const { password } = account;

            return request.auth.signup(username, email, password)
               .then((res) => {
                  expect(res).to.have.status(400);
                  expect(res).to.have.header('content-type', 'application/json');
                  expect(res.body).to.be.an('object');
                  expect(res.body).to.have.property('invalid');
                  expect(res.body.invalid).to.be.an('array');
                  expect(res.body.invalid).contain('email');
               })
               .catch((err) => {
                  throw err;
               });
         });

         it('expects 400 due to non-unique username and email', () => request.auth.signup(account.username, account.email(), account.password)
            .then((res) => {
               expect(res).to.have.status(400);
               expect(res).to.have.header('content-type', 'application/json');
               expect(res.body).to.be.an('object');
               expect(res.body).to.have.property('invalid');
               expect(res.body.invalid).to.be.an('array');
               expect(res.body.invalid).contain('username');
               expect(res.body.invalid).contain('email');
            })
            .catch((err) => {
               throw err;
            }));
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

         after('Account destruction', () => utility.hooks.removeAccount(account));

         // -------------------------------------------------------------------------------------

         it('expects 200 and token + username', () => request.auth.signup(account.username, account.email(), account.password)
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
