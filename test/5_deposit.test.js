const chai = require('chai');
const chaiHttp = require('chai-http');
const { StatusCodes } = require('http-status-codes');

const server = require('../index');
const { getBalance } = require('../model/balance');

const { expect } = chai;

chai.use(chaiHttp);

describe('5 - DEPOSIT', () => {
  describe('5.1 - Check GET methods', () => {
    it('Check if an admin can get all deposits', async () => {
      const login = await chai.request(server)
        .post('/login')
        .set('Content-Type', 'application/json')
        .send({
          cpf: '09859973628',
          password: 'braavos'
        });

      const response = await chai.request(server)
      .get('/deposit')
      .set('token', login.body.token)
      .send({});
      expect(response).to.have.status(StatusCodes.OK);
      expect(response.body).to.be.an('array');
      expect(response.body[0]).to.have.property('id_deposit');
      expect(response.body[0]).to.have.property('cpf');
      expect(response.body[0]).to.have.property('value');
      expect(response.body[0]).to.have.property('original_currency');
    });

    it('Check if a regular user cannot get all deposits', async () => {
      const login = await chai.request(server)
        .post('/login')
        .set('Content-Type', 'application/json')
        .send({
          cpf: '22222222222',
          password: 'braavos'
        });

      const response = await chai.request(server)
      .get('/deposit')
      .set('token', login.body.token)
      .send({});
      expect(response).to.have.status(StatusCodes.UNAUTHORIZED);
    });

    it('Check if an admin can get all deposits from any specific user', async () => {
      const login = await chai.request(server)
        .post('/login')
        .set('Content-Type', 'application/json')
        .send({
          cpf: '09859973628',
          password: 'braavos'
        });

      const response = await chai.request(server)
      .get('/deposit/12345678901')
      .set('token', login.body.token)
      .send({});
      expect(response).to.have.status(StatusCodes.OK);
      expect(response.body).to.be.an('array');
      expect(response.body[0]).to.have.property('id_deposit');
      expect(response.body[0]).to.have.property('cpf');
      expect(response.body[0]).to.have.property('value');
      expect(response.body[0]).to.have.property('original_currency');
    });

    it('Check if a regular user can get all his deposits', async () => {
      const login = await chai.request(server)
        .post('/login')
        .set('Content-Type', 'application/json')
        .send({
          cpf: '22222222222',
          password: 'braavos'
        });

      const response = await chai.request(server)
      .get('/deposit/22222222222')
      .set('token', login.body.token)
      .send({});
      expect(response).to.have.status(StatusCodes.OK);
      expect(response.body).to.be.an('array');
      expect(response.body[0]).to.have.property('id_deposit');
      expect(response.body[0]).to.have.property('cpf');
      expect(response.body[0]).to.have.property('value');
      expect(response.body[0]).to.have.property('original_currency');
    });

    it('Check if a regular user cannot get all deposits from somebody else\'s account', async () => {
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

  describe('5.2 - Check POST methods', () => {
    it('Check if anyone, even without token, can deposit into an account', async () => {
      const response = await chai.request(server)
      .post('/deposit')
      .send({
        receiver: '12345678901',
        currency: 'BRL',
        value: 500
      });
      expect(response).to.have.status(StatusCodes.CREATED);
      
      const [data] = await getBalance('12345678901');
      expect(data.balance).to.equal('13130.00');
    });

    it('Check if it is not possible to deposit into an nonexistent account', async () => {
      const response = await chai.request(server)
      .post('/deposit')
      .send({
        receiver: '98998998998',
        currency: 'BRL',
        value: 500
      });
      expect(response).to.have.status(StatusCodes.BAD_REQUEST);
      expect(response.body.message).to.equal('The informed account does not exist.');
    });

    it('Check if it is possible to deposit in USD currency', async () => {
      const response = await chai.request(server)
      .post('/deposit')
      .send({
        receiver: '12345678901',
        currency: 'USD',
        value: 200
      });
      expect(response).to.have.status(StatusCodes.CREATED);
      
      const [data] = await getBalance('12345678901');
      expect(+data.balance).to.be.gt(12630);
    });

    it('Check if it is not possible to deposit in any other currency', async () => {
      const response = await chai.request(server)
      .post('/deposit')
      .send({
        receiver: '12345678901',
        currency: 'EUR',
        value: 100
      });
      expect(response).to.have.status(StatusCodes.BAD_REQUEST);
      expect(response.body.message).to.equal('Only BRL and USD deposits are allowed.');
    });

    it('Check if it is not possible to deposit negative values', async () => {
      const response = await chai.request(server)
      .post('/deposit')
      .send({
        receiver: '12345678901',
        currency: 'BRL',
        value: -100
      });
      expect(response).to.have.status(StatusCodes.BAD_REQUEST);
      expect(response.body.message).to.equal('The value must be a number higher than zero.');
    });

    it('Check if it is not possible to deposit negative values', async () => {
      const response = await chai.request(server)
      .post('/deposit')
      .send({
        receiver: '12345678901',
        currency: 'BRL',
        value: 0
      });
      expect(response).to.have.status(StatusCodes.BAD_REQUEST);
      expect(response.body.message).to.equal('The value must be a number higher than zero.');
    });

    it('Check if it is not possible to deposit with string as value', async () => {
      const response = await chai.request(server)
      .post('/deposit')
      .send({
        receiver: '12345678901',
        currency: 'BRL',
        value: '1500'
      });
      expect(response).to.have.status(StatusCodes.BAD_REQUEST);
      expect(response.body.message).to.equal('The value must be a number higher than zero.');
    });

    it('Check if it is not possible to deposit values greater than BRL 2.000,00', async () => {
      const response = await chai.request(server)
      .post('/deposit')
      .send({
        receiver: '12345678901',
        currency: 'BRL',
        value: 2100
      });
      expect(response).to.have.status(StatusCodes.BAD_REQUEST);
      expect(response.body.message).to.equal('For security reasons, we are not allowed to receive deposits greater than BRL 2.000,00.');
    });

    it('Check if it is not possible to deposit USD values greater than BRL 2.000,00', async () => {
      const response = await chai.request(server)
      .post('/deposit')
      .send({
        receiver: '12345678901',
        currency: 'USD',
        value: 600
      });
      expect(response).to.have.status(StatusCodes.BAD_REQUEST);
      expect(response.body.message).to.equal('For security reasons, we are not allowed to receive deposits greater than BRL 2.000,00.');
    });

    it('Check if a blocked account cannot receive deposits', async () => {
      const response = await chai.request(server)
      .post('/deposit')
      .send({
        receiver: '17117117117',
        currency: 'BRL',
        value: 600
      });
      expect(response).to.have.status(StatusCodes.UNAUTHORIZED);
      expect(response.body.message).to.equal('The receiver is blocked, thus cannot receive any money.');
    });

    it('Check if a USD deposit costs fees', async () => {
      const response = await chai.request(server)
      .post('/deposit')
      .send({
        receiver: '12345678901',
        currency: 'USD',
        value: 100
      });
      expect(response).to.have.status(StatusCodes.CREATED);
      expect(+response.body.fee).to.be.gt(0);
    });

    it('Check if USD deposits are credited as BRL', async () => {
      const response = await chai.request(server)
      .post('/deposit')
      .send({
        receiver: '12345678901',
        currency: 'USD',
        value: 100
      });
      expect(response).to.have.status(StatusCodes.CREATED);
      expect(+response.body.value).to.be.gt(100);
    });
  });
});
