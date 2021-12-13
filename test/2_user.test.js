const chai = require('chai');
const chaiHttp = require('chai-http');
const { StatusCodes } = require('http-status-codes');

const server = require('../index');
const { getUser } = require('../model/user');

const { expect } = chai;

chai.use(chaiHttp);

describe('2 - USER', () => {
  describe('2.1 - Check GET methods', () => {
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

    it('Check if an admin can get any user information', async () => {
      const login = await chai.request(server)
        .post('/login')
        .set('Content-Type', 'application/json')
        .send({
          cpf: '09859973628',
          password: 'braavos'
        });

      const response = await chai.request(server)
      .get('/user/11111111111')
      .set('token', login.body.token)
      .send({});
      expect(response).to.have.status(StatusCodes.OK);
      expect(response.body).to.have.length(1);
      expect(response.body[0]).to.have.property('cpf');
      expect(response.body[0].name).to.equal('Usuário Teste');
    });

    it('Check if a regular user can get its information', async () => {
      const login = await chai.request(server)
        .post('/login')
        .set('Content-Type', 'application/json')
        .send({
          cpf: '11111111111',
          password: 'braavos'
        });
  
      const response = await chai.request(server)
      .get('/user/11111111111')
      .set('token', login.body.token)
      .send({});
      expect(response).to.have.status(StatusCodes.OK);
      expect(response.body).to.have.length(1);
      expect(response.body[0]).to.have.property('cpf');
      expect(response.body[0].name).to.equal('Usuário Teste');
    });
  
    it('Check if a regular user cannot get somebody else\'s information', async () => {
      const login = await chai.request(server)
        .post('/login')
        .set('Content-Type', 'application/json')
        .send({
          cpf: '11111111111',
          password: 'braavos'
        });
  
      const response = await chai.request(server)
      .get('/user/22222222222')
      .set('token', login.body.token)
      .send({});
      expect(response).to.have.status(StatusCodes.UNAUTHORIZED);
    });
  });

  describe('2.2 - Check POST methods', () => {
    it('Check if it cannot create a user without CPF', async () => {
      const response = await chai.request(server)
        .post('/user')
        .set('Content-Type', 'application/json')
        .send({
          password: 'braavos',
          name: 'Mãe do Usuário Teste'
        });
      expect(response).to.have.status(StatusCodes.BAD_REQUEST);
      expect(response.body.message).to.equal(
        'Please inform CPF number, name and password to create an account.',
      );
    });

    it('Check if it cannot create a user without password', async () => {
      const response = await chai.request(server)
        .post('/user')
        .set('Content-Type', 'application/json')
        .send({
          cpf: '80610515080',
          name: 'Mãe do Usuário Teste'
        });
      expect(response).to.have.status(StatusCodes.BAD_REQUEST);
      expect(response.body.message).to.equal(
        'Please inform CPF number, name and password to create an account.',
      );
    });

    it('Check if it cannot create a user without name', async () => {
      const response = await chai.request(server)
        .post('/user')
        .set('Content-Type', 'application/json')
        .send({
          cpf: '80610515080',
          password: 'braavos'
        });
      expect(response).to.have.status(StatusCodes.BAD_REQUEST);
      expect(response.body.message).to.equal(
        'Please inform CPF number, name and password to create an account.',
      );
    });

    it('Check if it cannot create a user without surname', async () => {
      const response = await chai.request(server)
        .post('/user')
        .set('Content-Type', 'application/json')
        .send({
          cpf: '80610515080',
          password: 'braavos',
          name: 'Mãe'
        });
      expect(response).to.have.status(StatusCodes.BAD_REQUEST);
      expect(response.body.message).to.equal('Please inform your full name.');
    });

    it('Check if it cannot create a user with a preexistent CPF', async () => {
      const response = await chai.request(server)
        .post('/user')
        .set('Content-Type', 'application/json')
        .send({
          cpf: '09859973628',
          password: 'braavos',
          name: 'Mãe do Usuário Teste'
        });
      expect(response).to.have.status(StatusCodes.BAD_REQUEST);
      expect(response.body.message).to.equal('This CPF is already registered.');
    });

    it('Check if anyone, even without token, can create a user with name, CPF and hased password', async () => {
      const response = await chai.request(server)
        .post('/user')
        .set('Content-Type', 'application/json')
        .send({
          cpf: '80610515080',
          password: 'braavos',
          name: 'Mãe do Usuário Teste'
        });
      expect(response).to.have.status(StatusCodes.OK);
      expect(response.body[0].affectedRows).to.equal(1);

      const data = await getUser("80610515080");
      expect(data.password).to.not.be.equal('braavos');
    });
  });
});
