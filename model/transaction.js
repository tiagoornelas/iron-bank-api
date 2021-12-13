const mysql = require('../connection/mysql');

const getTransactions = async (cpf) => {
  if (!cpf) {
    const [result] = await mysql.query(
      `SELECT transaction.id_transaction,
              user_from.cpf AS from_user,
              user_to.cpf AS to_user,
              transaction.value,
              transaction.created_at
        FROM TRANSACTION
        INNER JOIN USER AS user_from ON transaction.from_user = user_from.id_user
        INNER JOIN USER AS user_to ON transaction.to_user = user_to.id_user`,
    );
    return result;
  }
  const [result] = await mysql.query(
    `SELECT transaction.id_transaction,
            user_from.cpf AS from_user,
            user_to.cpf AS to_user,
            transaction.value,
            transaction.created_at
        FROM TRANSACTION
        INNER JOIN USER AS user_from ON transaction.from_user = user_from.id_user
        INNER JOIN USER AS user_to ON transaction.to_user = user_to.id_user
        WHERE user_from.cpf = ?
        OR user_to.cpf = ?`,
    [cpf, cpf],
  );
  return result;
};

const getTransactionInfo = async (transactionId) => {
  const [result] = await mysql.query(
    `SELECT *
    FROM TRANSACTION
    WHERE transaction.id_transaction = ?
    `,
    [transactionId],
  );
  return result;
}

const transferAmount = async (from, to, value) => {
  const [result] = await mysql.query(
    `INSERT INTO transaction (from_user, to_user, value)
    VALUES (?, ?, ?)`,
    [from, to, value],
  );
  return result;
}

const flagTransaction = async (transactionId) => {
  const [result] = await mysql.query(
    `UPDATE TRANSACTION
    SET fraud_flag = 1,
        flagged_at = now()
    WHERE transaction.id_transaction = ?`,
    [transactionId],
  );
  return result;
}

const blockUser = async (userId) => {
  const [result] = await mysql.query(
    `UPDATE user
    SET blocked = 1, blocked_at = now()
    WHERE user.id_user = ?`,
    [userId],
  );
  return result;
}

module.exports = {
  getTransactions, getTransactionInfo, transferAmount, flagTransaction, blockUser,
};
