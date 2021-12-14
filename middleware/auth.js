const { StatusCodes } = require('http-status-codes');
const jwt = require('jsonwebtoken');

const API_SECRET = process.env.API_SECRET || 'braavos';
const JWT_COFING = {
  expiresIn: '4h',
  algorithm: 'HS256',
};

const auth = async (req, res, next) => {
  const { token } = req.headers;
  if (!token) {
    return res.status(StatusCodes.UNAUTHORIZED).send({
      message: 'You are not logged in or you do not have permission to access this function.',
    });
  }
  try {
    const { id, cpf, admin } = jwt.verify(token, API_SECRET, JWT_COFING);
    req.user = {
      id,
      cpf,
      admin
    };
    return next();
  } catch (err) {
    if (err.message === 'invalid token') {
      return res.status(StatusCodes.UNAUTHORIZED).send({
        message: 'You are not logged in or you do not have permission to access this function.',
      });
    }
    return res.status(StatusCodes.UNAUTHORIZED).send({
      message: err.message,
    });
  }
};

module.exports = { auth, JWT_COFING};
