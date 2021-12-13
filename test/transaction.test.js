const chai = require('chai');
const chaiHttp = require('chai-http');
const { StatusCodes } = require('http-status-codes');

const server = require('../index');

const { expect } = chai;

chai.use(chaiHttp);

describe('TRANSACTION', () => {
  describe('Check GET methods', () => {
    it('Check if an admin can get all transactions', async () => {
      const login = await chai.request(server)
        .post('/login')
        .set('Content-Type', 'application/json')
        .send({
          cpf: '09859973628',
          password: 'braavos'
        });

      const response = await chai.request(server)
      .get('/transaction')
      .set('token', login.body.token)
      .send({});
      expect(response).to.have.status(StatusCodes.OK);
      expect(response.body).to.be.an('array');
      expect(response.body[0]).to.have.property('id_transaction');
      expect(response.body[0]).to.have.property('from_user');
      expect(response.body[0]).to.have.property('to_user');
      expect(response.body[0].value).to.equal('10000.00');
    });

    it('Check if a regular user cannot get all transactions', async () => {
      const login = await chai.request(server)
        .post('/login')
        .set('Content-Type', 'application/json')
        .send({
          cpf: '22222222222',
          password: 'braavos'
        });

      const response = await chai.request(server)
      .get('/transaction')
      .set('token', login.body.token)
      .send({});
      expect(response).to.have.status(StatusCodes.UNAUTHORIZED);
    });

    it('Check if an admin can get all transaction from and to any specific user', async () => {
      const login = await chai.request(server)
        .post('/login')
        .set('Content-Type', 'application/json')
        .send({
          cpf: '09859973628',
          password: 'braavos'
        });

      const response = await chai.request(server)
      .get('/transaction/12345678901')
      .set('token', login.body.token)
      .send({});
      expect(response).to.have.status(StatusCodes.OK);
      expect(response.body[0]).to.have.property('id_transaction');
      expect(response.body[0]).to.have.property('from_user');
      expect(response.body[0]).to.have.property('to_user');
      expect(response.body[0].value).to.equal('10000.00');
    });

    it('Check if a regular user can get all transactions from and to its account', async () => {
      const login = await chai.request(server)
        .post('/login')
        .set('Content-Type', 'application/json')
        .send({
          cpf: '12345678901',
          password: 'braavos'
        });

      const response = await chai.request(server)
      .get('/transaction/12345678901')
      .set('token', login.body.token)
      .send({});
      expect(response).to.have.status(StatusCodes.OK);
      expect(response.body[0]).to.have.property('id_transaction');
      expect(response.body[0]).to.have.property('from_user');
      expect(response.body[0]).to.have.property('to_user');
      expect(response.body[0].value).to.equal('10000.00');
    });

    it('Check if a regular user cannot get all transactions from and to somebody else\'s account', async () => {
      const login = await chai.request(server)
        .post('/login')
        .set('Content-Type', 'application/json')
        .send({
          cpf: '33333333333',
          password: 'braavos'
        });

      const response = await chai.request(server)
      .get('/transaction/22222222222')
      .set('token', login.body.token)
      .send({});
      expect(response).to.have.status(StatusCodes.UNAUTHORIZED);
    });

    it('Check if it is not possible to get transactions by a nonexistent account', async () => {
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
