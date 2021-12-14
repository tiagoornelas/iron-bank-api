const { StatusCodes } = require('http-status-codes');
const fetch = require('cross-fetch');

const { getUser } = require('../model/user');
const { getBalance } = require('../model/balance');

const adminCheck = async (req, res, next) => {
  try {
    const { admin } = req.user;
    if (admin === 0) {
      return res.status(StatusCodes.UNAUTHORIZED).send({
        message: 'You are not logged in or you do not have permission to access this function.',
      });
    }
    return next();
  } catch (err) {
    return next(err);
  }
};

const selfCheck = async (req, res, next) => {
  try {
    const { cpf: cpf_token, admin } = req.user;
    const { cpf: cpf_param } = req.params;
    if (admin === 0 && cpf_token !== cpf_param) {
      return res.status(StatusCodes.UNAUTHORIZED).send({
        message: 'You are not logged in or you do not have permission to access this function.',
      });
    }
    return next();
  } catch (err) {
    return next(err);
  }
};

const userCheck = async (req, res, next) => {
  const isCpfValid = (value) => {
    const match = value.toString().match(/\d/g);
    const numbers = Array.isArray(match) ? match.map(Number) : [];
    const items = [...new Set(numbers)];
    if (items.length === 1) {
      return false;
    } if (value.length === 11) {
      let sum;
      let remainder;
      sum = 0;
      if (value === '00000000000') return false;
  
      for (let i = 1; i <= 9; i += 1) sum += parseInt(value.substring(i - 1, i), 10) * (11 - i);
      remainder = (sum * 10) % 11;
  
      if ((remainder === 10) || (remainder === 11)) remainder = 0;
      if (remainder !== parseInt(value.substring(9, 10), 10)) return false;
  
      sum = 0;
      for (let i = 1; i <= 10; i += 1) sum += parseInt(value.substring(i - 1, i), 10) * (12 - i);
      remainder = (sum * 10) % 11;
  
      if ((remainder === 10) || (remainder === 11)) remainder = 0;
      if (remainder !== parseInt(value.substring(10, 11), 10)) return false;
      return true;
    }
    return false;
  };

  try {
    const { cpf, password, name } = req.body;
    if (!cpf || !password || !name) {
      return res.status(StatusCodes.BAD_REQUEST).send({
        message: 'Please inform CPF number, name and password to create an account.',
      });
    } if (!isCpfValid(cpf)) {
      return res.status(StatusCodes.BAD_REQUEST).send({
        message: 'Please inform a valid CPF.',
      });
    } if (name.split(' ').length <= 1) {
      return res.status(StatusCodes.BAD_REQUEST).send({
        message: 'Please inform your full name.',
      });
    }
    const data = await getUser(cpf);
    if (data.length > 0) {
      return res.status(StatusCodes.BAD_REQUEST).send({
        message: 'This CPF is already registered.',
      });
    }
    return next();
  } catch (err) {
    return next(err);
  }
};

const transferCheck = async (req, res, next) => {
  try {
    const { cpf: cpf_token } = req.user;
    const { receiver: cpf_body, value } = req.body;
    const data = await getUser(cpf_body);
    if (!cpf_body) {
      return res.status(StatusCodes.BAD_REQUEST).send({
        message: 'You need to inform receiver and value.',
      });
    } if (value !== 0 && !value) {
      return res.status(StatusCodes.BAD_REQUEST).send({
        message: 'You need to inform receiver and value.',
      });
    } if (data.length < 1) {
      return res.status(StatusCodes.BAD_REQUEST).send({
        message: 'The informed account does not exist.',
      });
    } if (value <= 0 || typeof value === 'string') {
      return res.status(StatusCodes.BAD_REQUEST).send({
        message: 'The value must be a number higher than zero.',
      });
    } 
    const [balance] = await getBalance(cpf_token);
    if (balance.balance < value) {
      return res.status(StatusCodes.NOT_ACCEPTABLE).send({
        message: 'Insufficient funds.',
      });
    }
    return next();
  } catch (err) {
    return next(err);
  }
};

const blockedCheck = async (req, res, next) => {
  try {
    if (req.user) {
      const { cpf: cpf_token } = req.user;
      const [tokenUser] = await getUser(cpf_token);
      if (tokenUser.blocked === 1) {
        return res.status(StatusCodes.UNAUTHORIZED).send({
          message: 'You were blocked by the Iron Bank administration.',
        });
      }
    }
    if (req.body.receiver) {
      const { receiver: cpf_body } = req.body;
      const [bodyuser] = await getUser(cpf_body);
      if (cpf_body && bodyuser.blocked === 1) {
        return res.status(StatusCodes.UNAUTHORIZED).send({
          message:'The receiver is blocked, thus cannot receive any money.',
        })
      }
    }
    return next();
  } catch (err) {
    next(err);
  }
};

const depositCheck = async (req, res, next) => {
  try {
    const { receiver: cpf_body, value, currency } = req.body;
    const data = await getUser(cpf_body);
    if (!cpf_body) {
      return res.status(StatusCodes.BAD_REQUEST).send({
        message: 'You need to inform receiver and value.',
      });
    } if (value !== 0 && !value) {
      return res.status(StatusCodes.BAD_REQUEST).send({
        message: 'You need to inform receiver and value.',
      });
    } if (data.length < 1) {
      return res.status(StatusCodes.BAD_REQUEST).send({
        message: 'The informed account does not exist.',
      });
    } if (value <= 0 || typeof value === 'string') {
      return res.status(StatusCodes.BAD_REQUEST).send({
        message: 'The value must be a number higher than zero.',
      });
    } if (currency !== 'BRL' && currency !== 'USD') {
      return res.status(StatusCodes.BAD_REQUEST).send({
        message: 'Only BRL and USD deposits are allowed.',
      });
    } if (currency === 'BRL') {
      if(+value > 2000) {
        return res.status(StatusCodes.BAD_REQUEST).send({
          message: 'For security reasons, we are not allowed to receive deposits greater than BRL 2.000,00.',
        });
      }
    } if (currency === 'USD') {
      const response = await fetch('https://economia.awesomeapi.com.br/json/all');
      const { USD: dolar } = await response.json();
      if (+value * dolar.ask > 2000) {
        return res.status(StatusCodes.BAD_REQUEST).send({
          message: 'For security reasons, we are not allowed to receive deposits greater than BRL 2.000,00.',
        });
      }
    }
    return next();
  } catch (err) {
    return next(err);
  }
};

const paymentCheck = async (req, res, next) => {
  const checkBillDetails = (barcode) => {
    let dueDate = new Date('1997-07-10');
    const value = +barcode.slice(-10) / 100;
    const daysFromDate = +barcode.slice(-14, -10);
    dueDate.setDate(dueDate.getDate() + daysFromDate);
    return {
      value,
      dueDate
    }
  };

  const { cpf: cpf_token } = req.user;
  const { barcode } = req.body;
  if (!barcode || barcode.length !== 47) {
    return res.status(StatusCodes.BAD_REQUEST).send({
      message: 'You need to inform a valid barcode.',
    });
  }
  if (checkBillDetails(barcode).dueDate < new Date()) {
    return res.status(StatusCodes.NOT_ACCEPTABLE).send({
      message: 'You cannot pay an overdue bill.',
    })
  }
  const [balance] = await getBalance(cpf_token);
    if (balance.balance < checkBillDetails(barcode).value) {
      return res.status(StatusCodes.NOT_ACCEPTABLE).send({
        message: 'Insufficient funds.',
      });
    }
    req.bill = {
      value: checkBillDetails(barcode).value,
    };
    return next();
}


module.exports = {
  adminCheck, selfCheck, userCheck, transferCheck, blockedCheck, depositCheck, paymentCheck,
};
