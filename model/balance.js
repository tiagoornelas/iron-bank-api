const mysql = require('../connection/mysql');

const getBalance = async (cpf) => {
  if (!cpf) {
    const [result] = await mysql.query(
      `SELECT user.cpf,
              IFNULL(SUM(deposit.value), 0)
              - IFNULL(SUM(payment.value), 0)
              - IFNULL(SUM(transaction_from.value), 0)
              + IFNULL(SUM(transaction_to.value), 0) AS balance
        FROM USER
        LEFT JOIN deposit ON user.id_user = deposit.to_user
        INNER JOIN exchange_fee ON deposit.id_exchange_fee = exchange_fee.id_exchange_fee
        LEFT JOIN payment ON user.id_user = payment.from_user
        LEFT JOIN TRANSACTION AS transaction_from ON user.id_user = transaction_from.from_user
        LEFT JOIN TRANSACTION AS transaction_to ON user.id_user = transaction_to.to_user
        GROUP BY user.id_user
        ORDER BY balance DESC,
                id_user`,
    );
    return result;
  }
  const [result] = await mysql.query(
    `SELECT user.cpf,
            IFNULL(SUM(deposit.value), 0)
            - IFNULL(SUM(payment.value), 0)
            - IFNULL(SUM(transaction_from.value), 0)
            + IFNULL(SUM(transaction_to.value), 0) AS balance
        FROM USER
        LEFT JOIN deposit ON user.id_user = deposit.to_user
        INNER JOIN exchange_fee ON deposit.id_exchange_fee = exchange_fee.id_exchange_fee
        LEFT JOIN payment ON user.id_user = payment.from_user
        LEFT JOIN TRANSACTION AS transaction_from ON user.id_user = transaction_from.from_user
        LEFT JOIN TRANSACTION AS transaction_to ON user.id_user = transaction_to.to_user
        WHERE user.cpf = ?
        GROUP BY user.id_user`,
    [cpf],
  );
  return result;
};

module.exports = { getBalance };
