const bcrypt = require('bcrypt');
const { addUser } = require('../model/user');

const prepareUserCreation = async (req) => {
  const SALT_ROUNDS = 10;
  const { name, password: pw, cpf } = req.body;
  const hashedPw = await bcrypt.hash(pw, SALT_ROUNDS);
  const result = await addUser(name, hashedPw, cpf);
  return result;
};

module.exports = { prepareUserCreation };