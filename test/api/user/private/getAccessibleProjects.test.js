const chai = require('chai');
const chaiHttp = require('chai-http');

const { expect } = chai;
chai.use(chaiHttp);

// -------------------------------------------------------------------------------------------------
// Test
// -------------------------------------------------------------------------------------------------

module.exports = (config, request, utility) => {
   describe('Get accessible projects', () => {
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
         it('expects 400 because of invalid limit value', () => request.user.getAccessibleProjects({
            limit: -5,
         }, account.token)
            .then((res) => {
               expect(res).to.have.status(400);
               expect(res).to.have.header('content-type', 'application/json');
               expect(res.body).to.be.an('object');
               expect(res.body).to.have.property('invalid');
               expect(res.body.invalid).to.be.an('array');
               expect(res.body.invalid).to.contain('limit');
            }));
      });

      // -------------------------------------------------------------------------------------------
      // Invalid
      // -------------------------------------------------------------------------------------------

      context('Valid', () => {
         it('expects 200', () => request.user.getAccessibleProjects({
            limit: 0,
         }, account.token)
            .then((res) => {
               expect(res).to.have.status(200);
               expect(res).to.have.header('content-type', 'application/json');
               expect(res.body).to.be.an('object');
               expect(res.body).to.have.all.keys('projects');
               expect(res.body.projects).to.have.all.keys('label', 'data');
               expect(res.body.projects.label).to.be.an('array');
               expect(res.body.projects.data).to.be.an('array');

               expect(res.body.projects.label.length).to.equal(5);

               expect(res.body.projects.label).to.contain('id');
               expect(res.body.projects.label).to.contain('owner');
               expect(res.body.projects.label).to.contain('name');
               expect(res.body.projects.label).to.contain('description');
               expect(res.body.projects.label).to.contain('version');
            }));
      });
   });
};
