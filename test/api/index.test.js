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
   },

   user: {
      removeAccount: token => chai.request(config.host)
         .del('/user/account')
         .set('Authorization', `Bearer ${token}`)
         .send(),
   },
};


// -------------------------------------------------------------------------------------------------
// Utilities
// -------------------------------------------------------------------------------------------------
const utility = {
   string: num => randomstring.generate(num),
};


// -------------------------------------------------------------------------------------------------
// Sections
// -------------------------------------------------------------------------------------------------

describe('CONNECTION', () => {
   it('User is online', async () => {
      const res = await chai.request('https://google.com/').get('/');
      expect(res.status).to.equal(200);
   });

   it('Server is online', async () => {
      const res = await chai.request(config.host).get('/');
      expect(res.status).to.equal(200);
   });
});

require('./authentication/sigin.test')(config, method, utility);
