const chai = require('chai');
const chaiHttp = require('chai-http');
const { StatusCodes } = require('http-status-codes');

const server = require('../index');
// const { getBalance } = require('../model/balance');
// const { getUser } = require('../model/user');

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
});
