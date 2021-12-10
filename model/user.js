const mysql = require('../connection/mysql');

const getUsers = async () => {
  const [result] = await mysql.query(
    `SELECT *
    FROM user`,
  );
  return result;
};

const getUser = async (cpf) => {
  const [result] = await mysql.query(
    `SELECT *
    FROM user
    WHERE cpf = ?`,
    [cpf],
  );
  return result;
};

const addUser = async (name, username, pw) => {
  const result = await mysql.query(
    `INSERT INTO user (name, password, cpf)
    VALUES (?, ?, ?)`,
    [name, username, pw],
  );
  return result;
};

module.exports = { getUsers, getUser, addUser };
