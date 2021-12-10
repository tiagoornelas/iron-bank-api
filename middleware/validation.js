const { StatusCodes } = require('http-status-codes');
const { getUser } = require('../model/user');

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

module.exports = { adminCheck, selfCheck, userCheck };
