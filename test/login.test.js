const chai = require('chai');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');

const server = require('../index');

const API_SECRET = process.env.API_SECRET || 'braavos';
const JWT_COFING = {
  expiresIn: '4h',
  algorithm: 'HS256',
};

const { expect } = chai;

chai.use(chaiHttp);

describe('LOGIN', () => {
  describe('Check POST methods', () => {
    it('Check if it cannot log in without CPF', async () => {
      const response = await chai.request(server)
        .post('/login')
        .set('Content-Type', 'application/json')
        .send({});
      expect(response).to.have.status(StatusCodes.UNAUTHORIZED);
      expect(response.body.message).to.equal('Invalid login or password.');
    });

    it('Check if it cannot log in without password', async () => {
      const response = await chai.request(server)
        .post('/login')
        .send({});
      expect(response).to.have.status(StatusCodes.UNAUTHORIZED);
      expect(response.body.message).to.equal('Invalid login or password.');
    });

    it('Check if it cannot log in with CPF length different than 11', async () => {
      const response = await chai.request(server)
      .post('/login')
      .set('Content-Type', 'application/json')
      .send({
          "cpf": "09859973",
          "password": "123465"
        });
      expect(response).to.have.status(StatusCodes.UNAUTHORIZED);
      expect(response.body.message).to.equal('Invalid login or password.');
    });

    it('Check if it cannot log in with a nonexistent user', async () => {
      const response = await chai.request(server)
      .post('/login')
      .set('Content-Type', 'application/json')
      .send({
          "cpf": "00000000000",
          "password": "123456"
        });
      expect(response).to.have.status(StatusCodes.UNAUTHORIZED);
      expect(response.body.message).to.equal('Invalid login or password.');
    });

    it('Check if it cannot log in with a incorrect password for the user', async () => {
      const response = await chai.request(server)
      .post('/login')
      .set('Content-Type', 'application/json')
      .send({
        "cpf": "09859973628",
        "password": "123456"
      });
      expect(response).to.have.status(StatusCodes.UNAUTHORIZED);
      expect(response.body.message).to.equal('Invalid login or password.');
    });

    it('Check if it can login with right credentials', async () => {
      const response = await chai.request(server)
      .post('/login')
      .set('Content-Type', 'application/json')
      .send({
        "cpf": "09859973628",
        "password": "braavos"
      });
      expect(response).to.have.status(StatusCodes.OK);
      expect(response.body).to.have.property('token');

      const { cpf } = jwt.verify(response.body.token, API_SECRET, JWT_COFING);
      expect(cpf).to.equal("09859973628");
    });
  })
});