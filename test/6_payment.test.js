const chai = require('chai');
const chaiHttp = require('chai-http');
const { StatusCodes } = require('http-status-codes');

const server = require('../index');

const { expect } = chai;

chai.use(chaiHttp);

describe('6 - PAYMENT', () => {
  describe('6.1 - Check GET methods', () => {
    it('Check if an admin can get all payments', async () => {
      const login = await chai.request(server)
        .post('/login')
        .set('Content-Type', 'application/json')
        .send({
          cpf: '09859973628',
          password: 'braavos'
        });

      const response = await chai.request(server)
      .get('/payment')
      .set('token', login.body.token)
      .send({});
      expect(response).to.have.status(StatusCodes.OK);
      expect(response.body).to.be.an('array');
      expect(response.body[0]).to.have.property('id_payment');
      expect(response.body[0]).to.have.property('value');
    });

    it('Check if a regular user cannot get all payments', async () => {
      const login = await chai.request(server)
        .post('/login')
        .set('Content-Type', 'application/json')
        .send({
          cpf: '22222222222',
          password: 'braavos'
        });

      const response = await chai.request(server)
      .get('/payment')
      .set('token', login.body.token)
      .send({});
      expect(response).to.have.status(StatusCodes.UNAUTHORIZED);
    });

    it('Check if an admin can get all payments from any specific user', async () => {
      const login = await chai.request(server)
        .post('/login')
        .set('Content-Type', 'application/json')
        .send({
          cpf: '09859973628',
          password: 'braavos'
        });

      const response = await chai.request(server)
      .get('/payment/12345678901')
      .set('token', login.body.token)
      .send({});
      expect(response).to.have.status(StatusCodes.OK);
      expect(response.body).to.be.an('array');
      expect(response.body[0]).to.have.property('id_payment');
      expect(response.body[0]).to.have.property('value');
    });

    it('Check if a regular user cannot get all payments from somebody else\'s account', async () => {
      const login = await chai.request(server)
        .post('/login')
        .set('Content-Type', 'application/json')
        .send({
          cpf: '22222222222',
          password: 'braavos'
        });

      const response = await chai.request(server)
      .get('/deposit/33333333333')
      .set('token', login.body.token)
      .send({});
      expect(response).to.have.status(StatusCodes.UNAUTHORIZED);
    });
  });

  describe('6.2 - Check POST methods', () => {
    it('Check if an user can pay a bill with barcode', async () => {
      const login = await chai.request(server)
        .post('/login')
        .set('Content-Type', 'application/json')
        .send({
          cpf: '12345678901',
          password: 'braavos'
        });

      const response = await chai.request(server)
      .post('/payment')
      .set('token', login.body.token)
      .send({
        barcode: '26090391918011797497451500000008798400000029856',
      });
      expect(response).to.have.status(StatusCodes.OK);
      expect(response.body.message).to.equal('Bill succesfully paid [fictional].')
    });

    it('Check if an user cannot pay a bill which value is higher than balance', async () => {
      const login = await chai.request(server)
        .post('/login')
        .set('Content-Type', 'application/json')
        .send({
          cpf: '22222222222',
          password: 'braavos'
        });

      const response = await chai.request(server)
      .post('/payment')
      .set('token', login.body.token)
      .send({
        barcode: '26090391918011797497451500000008798400000129856',
      });
      expect(response).to.have.status(StatusCodes.NOT_ACCEPTABLE);
      expect(response.body.message).to.equal('Insufficient funds.')
    });

    it('Check if an user cannot pay an overdue bill', async () => {
      const login = await chai.request(server)
        .post('/login')
        .set('Content-Type', 'application/json')
        .send({
          cpf: '22222222222',
          password: 'braavos'
        });

      const response = await chai.request(server)
      .post('/payment')
      .set('token', login.body.token)
      .send({
        barcode: '26090391918011797497451500000008788000000029856',
      });
      expect(response).to.have.status(StatusCodes.NOT_ACCEPTABLE);
      expect(response.body.message).to.equal('You cannot pay an overdue bill.')
    });

    it('Check if it is not possible to pay bills with empty barcode', async () => {
      const login = await chai.request(server)
        .post('/login')
        .set('Content-Type', 'application/json')
        .send({
          cpf: '22222222222',
          password: 'braavos'
        });

      const response = await chai.request(server)
      .post('/payment')
      .set('token', login.body.token)
      .send({});
      expect(response).to.have.status(StatusCodes.BAD_REQUEST);
      expect(response.body.message).to.equal('You need to inform a valid barcode.')
    });
  });
});
