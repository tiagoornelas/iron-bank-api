const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { getUser } = require('../model/user');
const { JWT_CONFIG } = require('../middleware/auth');

const API_SECRET = process.env.API_SECRET || 'braavos';

const checkCredentials = async (cpf, password) => {
  const [data] = await getUser(cpf);
  if (!cpf || cpf.length !== 11 || !password || !data) {
    return {
      success: false,
    };
  }
  const pwMatch = await bcrypt.compare(password, data.password);
  if (!pwMatch) {
    return {
      success: false,
    };
  }
  const token = jwt.sign(
    { id: data.id_user, cpf: data.cpf, admin: data.admin },
    API_SECRET,
    JWT_CONFIG,
  );
  return {
    success: true,
    response: {
      token,
    },
  };
};

module.exports = { checkCredentials };
