const chai = require('chai');
// const sinon = require('sinon');
// const jwt = require('jsonwebtoken');
const chaiHttp = require('chai-http');
const { StatusCodes } = require('http-status-codes');

const server = require('../index');
const seedQuery = require('../seed');
const mysql = require('../connection/mysql');

const { expect } = chai;

chai.use(chaiHttp);

describe('LOGIN', () => {
  before( async () => {
    mysql.query(seedQuery)
  });

  after( async () => {
    mysql.query(seedQuery)
  });

  describe('Check POST methods', () => {
    it('Check if it cannot log in without CPF', async () => {
      const response = await chai.request(server)
        .post('/login')
        .set('Content-Type', 'application/json')
        .send({});
      expect(response).to.have.status(StatusCodes.UNAUTHORIZED);
    });

    it('Check if it cannot log in without password', async () => {
      const response = await chai.request(server)
        .post('/login')
        .send({});
      expect(response).to.have.status(StatusCodes.UNAUTHORIZED);
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
    });
  })

})