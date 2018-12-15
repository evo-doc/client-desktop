const chai = require('chai');
const chaiHttp = require('chai-http');
const randomstring = require('randomstring');

const { expect } = chai;
chai.use(chaiHttp);

// -------------------------------------------------------------------------------------------------
// Config
// -------------------------------------------------------------------------------------------------
const serverConfig = require('../../src/config/server.config');

const config = Object.assign({}, serverConfig, {
   example: 'example',
});


// -------------------------------------------------------------------------------------------------
// API Methods
// -------------------------------------------------------------------------------------------------
const method = {
   auth: {
      signin: (login, password) => chai.request(config.host)
         .post('/auth/signin')
         .send({ login, password }),

      signup: (username, email, password) => chai.request(config.host)
         .post('/auth/signup')
         .send({ username, email, password }),

      authenticated: token => chai.request(config.host)
         .get('/auth/authenticated')
         .set('Authorization', `Bearer ${token}`)
         .send(),

   },

   statistics: {
      common: token => chai.request(config.host)
         .get('/stats/common')
         .set('Authorization', `Bearer ${token}`)
         .send(),
   },

   user: {
      getAllUsers: token => chai.request(config.host)
         .get('/users')
         .set('Authorization', `Bearer ${token}`)
         .send(),

      getUserAccount: (username, token) => chai.request(config.host)
         .get(`/users/${username}/account`)
         .set('Authorization', `Bearer ${token}`)
         .send(),

      // getUserPackages: () => {}


      getOwnAccount: token => chai.request(config.host)
         .get('/user/account')
         .set('Authorization', `Bearer ${token}`)
         .send(),

      editOwnAccount: (data, token) => chai.request(config.host)
         .patch('/user/account')
         .set('Authorization', `Bearer ${token}`)
         .send(data),

      removeAccount: token => chai.request(config.host)
         .del('/user/account')
         .set('Authorization', `Bearer ${token}`)
         .send(),

      changePassword: (data, token) => chai.request(config.host)
         .patch('/user/account/password')
         .set('Authorization', `Bearer ${token}`)
         .send(data),

      getAccessibleProjects: (data, token) => chai.request(config.host)
         .post('/user/projects')
         .set('Authorization', `Bearer ${token}`)
         .send(data),

   },
};


// -------------------------------------------------------------------------------------------------
// Utilities
// -------------------------------------------------------------------------------------------------
const utility = {
   string: num => randomstring.generate(num),

   hooks: {
      createAccount: account => method.auth.signup(
         account.username, account.email(), account.password,
      )
         .then((res) => {
            expect(res).to.have.status(200);
            expect(res).to.have.header('content-type', 'application/json');
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('token');
            expect(res.body.token).to.be.a('string');
            return res.body.token;
         })
         .catch((err) => {
            throw err;
         }),

      removeAccount: account => method.user.removeAccount(account.token)
         .then((res) => {
            expect(res).to.have.status(200);
         })
         .catch((err) => {
            throw err;
         }),
   },
};


// -------------------------------------------------------------------------------------------------
// Sections
// -------------------------------------------------------------------------------------------------

describe('CONNECTION', () => {
   it('User is online', () => chai.request('https://google.com/')
      .get('/')
      .then((res) => {
         expect(res.status).to.equal(200);
      })
      .catch((err) => {
         throw err;
      }));

   it('Server is online', () => chai.request(config.host)
      .get('/')
      .then((res) => {
         expect(res.status).to.equal(200);
      })
      .catch((err) => {
         throw err;
      }));
});

// -------------------------------------------------------------------------------------------------

describe('AUTHENTICATION', () => {
   require('./authentication/signin.test')(config, method, utility);
   require('./authentication/signup.test')(config, method, utility);
   require('./authentication/authenticated.test')(config, method, utility);
});

// -------------------------------------------------------------------------------------------------

describe('STATISTICS', () => {
   require('./statistics/common.test')(config, method, utility);
});

// -------------------------------------------------------------------------------------------------


describe('USER', async () => {
   describe('USERS PUBLIC', () => {
      require('./user/public/getAllUsers.test')(config, method, utility);
      require('./user/public/getUserAccount.test')(config, method, utility);
      require('./user/public/getUserPackages.test')(config, method, utility);
   });

   describe('USER PRIVATE', () => {
      require('./user/private/getOwnAccount.test')(config, method, utility);
      require('./user/private/editOwnAccount.test')(config, method, utility);
      require('./user/private/changePassword.test')(config, method, utility);
      require('./user/private/getAccessibleProjects.test')(config, method, utility);
   });
});

// -------------------------------------------------------------------------------------------------

describe('PROJECTS', () => true);

// -------------------------------------------------------------------------------------------------

describe('MODULES', () => {

});
