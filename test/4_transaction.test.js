const chai = require('chai');
const chaiHttp = require('chai-http');
const { StatusCodes } = require('http-status-codes');

const server = require('../index');
const { getBalance } = require('../model/balance');

const { expect } = chai;

chai.use(chaiHttp);

describe('4 - TRANSACTION', () => {
  describe('4.1 - Check GET methods', () => {
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
          cpf: '11111111111',
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

  describe('4.2 - Check POST methods', () => {
    it('Check if the user can transfer money from its account to an existent account', async () => {
      const login = await chai.request(server)
        .post('/login')
        .set('Content-Type', 'application/json')
        .send({
          cpf: '09859973628',
          password: 'braavos'
        });

      const response = await chai.request(server)
      .post('/transaction')
      .set('token', login.body.token)
      .send({
        receiver: '12345678901',
        value: 500
      });
      expect(response).to.have.status(StatusCodes.CREATED);
      expect(response.body.message).to.equal('Successfuly transfered BRL 500 from 09859973628 to 12345678901');

      const [dataReceiver] = await getBalance("12345678901");
      expect(dataReceiver.balance).to.be.equal('12630.00');

      const [dataSender] = await getBalance("09859973628");
      expect(dataSender.balance).to.be.equal('8775.00');
    });

    it('Check if the user cannot transfer money without a receiver', async () => {
      const login = await chai.request(server)
        .post('/login')
        .set('Content-Type', 'application/json')
        .send({
          cpf: '09859973628',
          password: 'braavos'
        });

      const response = await chai.request(server)
      .post('/transaction')
      .set('token', login.body.token)
      .send({
        value: 500
      });
      expect(response).to.have.status(StatusCodes.BAD_REQUEST);
      expect(response.body.message).to.equal('You need to inform receiver and value.');

      const [dataSender] = await getBalance("09859973628");
      expect(dataSender.balance).to.be.equal('8775.00');
    });

    it('Check if the user cannot transfer money without a value', async () => {
      const login = await chai.request(server)
        .post('/login')
        .set('Content-Type', 'application/json')
        .send({
          cpf: '09859973628',
          password: 'braavos'
        });

      const response = await chai.request(server)
      .post('/transaction')
      .set('token', login.body.token)
      .send({
        receiver: '00000000000',
      });
      expect(response).to.have.status(StatusCodes.BAD_REQUEST);
      expect(response.body.message).to.equal('You need to inform receiver and value.');

      const [dataSender] = await getBalance("09859973628");
      expect(dataSender.balance).to.be.equal('8775.00');
    });

    it('Check if the user cannot transfer money to a non existent account', async () => {
      const login = await chai.request(server)
        .post('/login')
        .set('Content-Type', 'application/json')
        .send({
          cpf: '09859973628',
          password: 'braavos'
        });

      const response = await chai.request(server)
      .post('/transaction')
      .set('token', login.body.token)
      .send({
        receiver: '00000000000',
        value: 500
      });
      expect(response).to.have.status(StatusCodes.BAD_REQUEST);
      expect(response.body.message).to.equal('The informed account does not exist.');

      const [dataSender] = await getBalance("09859973628");
      expect(dataSender.balance).to.be.equal('8775.00');
    });

    it('Check if it is not possible to transfer negative values', async () => {
      const login = await chai.request(server)
        .post('/login')
        .set('Content-Type', 'application/json')
        .send({
          cpf: '09859973628',
          password: 'braavos'
        });

      const response = await chai.request(server)
      .post('/transaction')
      .set('token', login.body.token)
      .send({
        receiver: '12345678901',
        value: -500
      });
      expect(response).to.have.status(StatusCodes.BAD_REQUEST);
      expect(response.body.message).to.equal('The value must be a number higher than zero.');

      const [dataSender] = await getBalance("09859973628");
      expect(dataSender.balance).to.be.equal('8775.00');
    });

    it('Check it it is not possible to transfer with zero as value', async () => {
      const login = await chai.request(server)
        .post('/login')
        .set('Content-Type', 'application/json')
        .send({
          cpf: '09859973628',
          password: 'braavos'
        });

      const response = await chai.request(server)
      .post('/transaction')
      .set('token', login.body.token)
      .send({
        receiver: '12345678901',
        value: 0
      });
      expect(response).to.have.status(StatusCodes.BAD_REQUEST);
      expect(response.body.message).to.equal('The value must be a number higher than zero.');

      const [dataSender] = await getBalance("09859973628");
      expect(dataSender.balance).to.be.equal('8775.00');
    });

    it('Check it it is not possible to transfer with string as value', async () => {
      const login = await chai.request(server)
        .post('/login')
        .set('Content-Type', 'application/json')
        .send({
          cpf: '09859973628',
          password: 'braavos'
        });

      const response = await chai.request(server)
      .post('/transaction')
      .set('token', login.body.token)
      .send({
        receiver: '12345678901',
        value: '500.00'
      });
      expect(response).to.have.status(StatusCodes.BAD_REQUEST);
      expect(response.body.message).to.equal('The value must be a number higher than zero.');

      const [dataSender] = await getBalance("09859973628");
      expect(dataSender.balance).to.be.equal('8775.00');
    });

    it('Check if it is not possible to transfer more money than the user has', async () => {
      const login = await chai.request(server)
        .post('/login')
        .set('Content-Type', 'application/json')
        .send({
          cpf: '11111111111',
          password: 'braavos'
        });

      const response = await chai.request(server)
      .post('/transaction')
      .set('token', login.body.token)
      .send({
        receiver: '12345678901',
        value: 600
      });
      expect(response).to.have.status(StatusCodes.NOT_ACCEPTABLE);
      expect(response.body.message).to.equal('Insufficient funds.');

      const [dataSender] = await getBalance("11111111111");
      expect(dataSender.balance).to.be.equal('500.00');
    });
  });

  // describe('4.3 - Check FRAUD PREVENTION (POST and GET) methods', () => {
  //   it('Check if the user can transfer money from its account to an existent account', async () => {
  //     const login = await chai.request(server)
  //       .post('/login')
  //       .set('Content-Type', 'application/json')
  //       .send({
  //         cpf: '09859973628',
  //         password: 'braavos'
  //       });

  //     const response = await chai.request(server)
  //     .post('/transaction')
  //     .set('token', login.body.token)
  //     .send({
  //       receiver: '12345678901',
  //       value: 500
  //     });
  //     expect(response).to.have.status(StatusCodes.CREATED);
  //     expect(response.body[0].affectedRows).to.equal(1);

  //     const dataReceiver = await getBalance("12345678901");
  //     expect(dataReceiver.balance).to.be.equal('12630.00');

  //     const [dataSender] = await getBalance("09859973628");
  //     expect(dataSender.balance).to.be.equal('8775.00');
  //   });

  // });
});
