const chai = require('chai');
const chaiHttp = require('chai-http');
const { StatusCodes } = require('http-status-codes');

const server = require('../index');

const { expect } = chai;

chai.use(chaiHttp);

describe('7 - PROFIT', () => {
  describe('7.1 - Check GET methods', () => {
    it('Check if an admin can get the bank profit value', async () => {
      const login = await chai.request(server)
        .post('/login')
        .set('Content-Type', 'application/json')
        .send({
          cpf: '09859973628',
          password: 'braavos'
        });

      const response = await chai.request(server)
      .get('/profit')
      .set('token', login.body.token)
      .send({});
      expect(response).to.have.status(StatusCodes.OK);
      expect(response.body).to.be.an('object');
      expect(response.body).to.have.property('profit');
    });

    it('Check if a regular user cannot get the bank profit value', async () => {
      const login = await chai.request(server)
        .post('/login')
        .set('Content-Type', 'application/json')
        .send({
          cpf: '11111111111',
          password: 'braavos'
        });

      const response = await chai.request(server)
      .get('/user')
      .set('token', login.body.token)
      .send({});
      expect(response).to.have.status(StatusCodes.UNAUTHORIZED);
    });
  });
});
