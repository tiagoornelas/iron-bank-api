const chai = require('chai');
const chaiHttp = require('chai-http');
const { StatusCodes } = require('http-status-codes');

const server = require('../index');

const { expect } = chai;

chai.use(chaiHttp);

describe('3 - BALANCE', () => {
  describe('3.1 - Check GET methods', () => {
    it('Check if an admin can get an array with balance from all accounts', async () => {
      const login = await chai.request(server)
        .post('/login')
        .set('Content-Type', 'application/json')
        .send({
          cpf: '09859973628',
          password: 'braavos'
        });

      const response = await chai.request(server)
      .get('/balance')
      .set('token', login.body.token)
      .send({});
      expect(response).to.have.status(StatusCodes.OK);
      expect(response.body).to.be.an('array');
      expect(response.body[0]).to.have.property('cpf');
      expect(response.body[0]).to.have.property('balance');
    });

    it('Check if a regular user cannot get an array with balance from all accounts', async () => {
      const login = await chai.request(server)
        .post('/login')
        .set('Content-Type', 'application/json')
        .send({
          cpf: '22222222222',
          password: 'braavos'
        });

      const response = await chai.request(server)
      .get('/balance')
      .set('token', login.body.token)
      .send({});
      expect(response).to.have.status(StatusCodes.UNAUTHORIZED);
    });

    it('Check if an admin can get account balance from any specific user', async () => {
      const login = await chai.request(server)
        .post('/login')
        .set('Content-Type', 'application/json')
        .send({
          cpf: '09859973628',
          password: 'braavos'
        });

      const response = await chai.request(server)
      .get('/balance/12345678901')
      .set('token', login.body.token)
      .send({});
      expect(response).to.have.status(StatusCodes.OK);
      expect(response.body.length).to.equal(1);
      expect(response.body[0]).to.have.property('cpf');
      expect(response.body[0].cpf).to.equal('12345678901');
      expect(response.body[0]).to.have.property('balance');
    });

    it('Check if a regular user can get his own account balance', async () => {
      const login = await chai.request(server)
        .post('/login')
        .set('Content-Type', 'application/json')
        .send({
          cpf: '12345678901',
          password: 'braavos'
        });

      const response = await chai.request(server)
      .get('/balance/12345678901')
      .set('token', login.body.token)
      .send({});
      expect(response).to.have.status(StatusCodes.OK);
      expect(response.body.length).to.equal(1);
      expect(response.body[0]).to.have.property('cpf');
      expect(response.body[0].cpf).to.equal('12345678901');
      expect(response.body[0]).to.have.property('balance');
    });

    it('Check if a regular user cannot get somebody else\'s account balance', async () => {
      const login = await chai.request(server)
        .post('/login')
        .set('Content-Type', 'application/json')
        .send({
          cpf: '11111111111',
          password: 'braavos'
        });

      const response = await chai.request(server)
      .get('/balance/22222222222')
      .set('token', login.body.token)
      .send({});
      expect(response).to.have.status(StatusCodes.UNAUTHORIZED);
    });

    it('Check if it is not possible to get balance from a nonexistent account', async () => {
      const login = await chai.request(server)
        .post('/login')
        .set('Content-Type', 'application/json')
        .send({
          cpf: '09859973628',
          password: 'braavos'
        });

      const response = await chai.request(server)
      .get('/balance/00000000000')
      .set('token', login.body.token)
      .send({});
      expect(response).to.have.status(StatusCodes.OK);
      expect(response.body.length).to.equal(0);
    });
  });
});
