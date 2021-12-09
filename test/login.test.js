const chai = require('chai');
const sinon = require('sinon');
const jwt = require('jsonwebtoken');
const chaiHttp = require('chai-http');
const { StatusCodes } = require('http-status-code');

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
    it('Check if it cannot log in without CPF', () => {
      let response;
      before(async () => {
        response = await chai.request(server)
          .post('/login')
          .send({})
      });

      expect(response).to.have.status(StatusCodes.BAD_REQUEST);
    });

    it('Check if it cannot log in without password', () => {
      let response;
      before(async () => {
        response = await chai.request(server)
          .post('/login')
          .send({})
      });
      
      expect(response).to.have.status(StatusCodes.BAD_REQUEST);
    });

    it('Check if it cannot log in with CPF length different than 11', () => {
      let response;
      before(async () => {
        response = await chai.request(server)
          .post('/login')
          .send({})
      });
      
      expect(response).to.have.status(StatusCodes.BAD_REQUEST);
    });

    it('Check if it cannot log in with a nonexistent user', () => {
      let response;
      before(async () => {
        response = await chai.request(server)
          .post('/login')
          .send({})
      });
      
      expect(response).to.have.status(StatusCodes.UNAUTHORIZED);
    });

    it('Check if it cannot log in with a incorrect password for the user', () => {
      let response;
      before(async () => {
        response = await chai.request(server)
          .post('/login')
          .send({})
      });
      
      expect(response).to.have.status(StatusCodes.UNAUTHORIZED);
    });

    it('Check if it can login with right credentials', () => {
      let response;
      before(async () => {
        response = await chai.request(server)
          .post('/login')
          .send({})
      });
      
      expect(response).to.have.status(StatusCodes.OK);
    });
  })

})