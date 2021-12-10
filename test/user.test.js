const chai = require('chai');
const chaiHttp = require('chai-http');
const { StatusCodes } = require('http-status-codes');

const server = require('../index');

const { expect } = chai;

chai.use(chaiHttp);

describe('USER', () => {
  describe('Check GET methods', () => {
    it('Check if an admin can get an array of all users', async () => {
      const login = await chai.request(server)
        .post('/login')
        .set('Content-Type', 'application/json')
        .send({
          cpf: '09859973628',
          password: 'braavos'
        });

      const response = await chai.request(server)
      .get('/user')
      .set('token', login.body.token)
      .send({});
      expect(response).to.have.status(StatusCodes.OK);
      expect(response.body).to.be.an('array');
      expect(response.body[0]).to.have.property('cpf');
    });

    it('Check if a regular user cannot get an array of all users', async () => {
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
  })
});