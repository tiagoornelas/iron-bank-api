const mysql = require('../connection/mysql');

const getDeposits = async (cpf) => {
  if (!cpf) {
    const [result] = await mysql.query(
      `SELECT deposit.id_deposit,
              user.cpf,
              deposit.value,
              IF(ISNULL(deposit.id_exchange_fee), 'BRL', 'USD') AS original_currency
        FROM deposit
        INNER JOIN USER ON deposit.to_user = user.id_user`,
    );
    return result;
  }
  const [result] = await mysql.query(
    `SELECT deposit.id_deposit,
            user.cpf,
            deposit.value,
            IF(ISNULL(deposit.id_exchange_fee), 'BRL', 'USD') AS original_currency
        FROM deposit
        INNER JOIN USER ON deposit.to_user = user.id_user
        WHERE user.cpf = ?`,
    [cpf],
  );
  return result;
};

const depositAmount = async (from, to, value) => {
  const [result] = await mysql.query(
    `INSERT INTO transaction (from_user, to_user, value)
    VALUES (?, ?, ?)`,
    [from, to, value],
  );
  return result;
}

module.exports = {
  getDeposits, depositAmount,
};
