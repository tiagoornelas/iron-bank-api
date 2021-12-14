const mysql = require('../connection/mysql');

const getBalance = async (cpf) => {
  if (!cpf) {
    const [result] = await mysql.query(
      `SELECT user.cpf,
              SUM(balance) AS balance
        FROM
        (SELECT deposit.to_user,
                IFNULL(SUM(deposit.value), 0) AS balance
          FROM deposit
          GROUP BY deposit.to_user
          UNION SELECT payment.from_user,
                      IFNULL(SUM(payment.value), 0) * -1 AS balance
          FROM payment
          GROUP BY payment.from_user
          UNION SELECT transaction.from_user,
                      IFNULL(SUM(transaction.value), 0) * -1 AS balance
          FROM TRANSACTION
          GROUP BY transaction.from_user
          UNION SELECT transaction.to_user,
                      IFNULL(SUM(transaction.value), 0) AS balance
          FROM TRANSACTION
          GROUP BY transaction.to_user) AS operations
        INNER JOIN USER ON operations.to_user = user.id_user
        GROUP BY operations.to_user
        ORDER BY balance DESC,
                id_user`,
    );
    return result;
  }
  const [result] = await mysql.query(
    `SELECT user.cpf,
            SUM(balance) AS balance
        FROM
        (SELECT deposit.to_user,
              IFNULL(SUM(deposit.value), 0) AS balance
        FROM deposit
        GROUP BY deposit.to_user
        UNION SELECT payment.from_user,
                    IFNULL(SUM(payment.value), 0) * -1 AS balance
        FROM payment
        GROUP BY payment.from_user
        UNION SELECT transaction.from_user,
                    IFNULL(SUM(transaction.value), 0) * -1 AS balance
        FROM TRANSACTION
        GROUP BY transaction.from_user
        UNION SELECT transaction.to_user,
                    IFNULL(SUM(transaction.value), 0) AS balance
        FROM TRANSACTION
        GROUP BY transaction.to_user) AS operations
        INNER JOIN USER ON operations.to_user = user.id_user
        WHERE user.cpf = ?
        GROUP BY operations.to_user
        ORDER BY balance DESC,
              id_user`,
    [cpf],
  );
  return result;
};

module.exports = { getBalance };
