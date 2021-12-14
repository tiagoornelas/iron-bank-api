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

const getDepositInfo = async (depositId) => {
  const [result] = await mysql.query(
    `SELECT *
    FROM deposit
    WHERE deposit.id_deposit = ?
    `,
    [depositId],
  );
  return result;
}

const chargeFee = async (usd_value, exchange_price, exchange_fee_brl) => {
  const [result] = await mysql.query(
    `INSERT INTO exchange_fee (usd_value, exchange_price, exchange_fee_brl)
    VALUES (?, ?, ?)`,
    [usd_value, exchange_price, exchange_fee_brl],
  );
  return result;
}

const depositUsdAmount = async (to_user, value, id_exchange_fee) => {
  const [result] = await mysql.query(
    `INSERT INTO deposit (to_user, value, id_exchange_fee)
    VALUES (?, ?, ?)`,
    [to_user, value, id_exchange_fee],
  );
  return result;
}


const depositBrlAmount = async (to_user, value) => {
  const [result] = await mysql.query(
    `INSERT INTO deposit (to_user, value)
    VALUES (?, ?)`,
    [to_user, value],
  );
  return result;
}


module.exports = {
  getDeposits, getDepositInfo, chargeFee, depositUsdAmount, depositBrlAmount
};
