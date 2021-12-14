const mysql = require('../connection/mysql');

const getPayments = async (cpf) => {
  if (!cpf) {
    const [result] = await mysql.query(
      `SELECT payment.id_payment,
              user.cpf,
              payment.value
        FROM payment
        INNER JOIN USER ON payment.from_user = user.id_user`,
    );
    return result;
  }
  const [result] = await mysql.query(
    `SELECT payment.id_payment,
            user.cpf,
            payment.value
        FROM payment
        INNER JOIN USER ON payment.from_user = user.id_user
        WHERE user.cpf = ?`,
    [cpf],
  );
  return result;
};

const payBill = async (from_user, value) => {
  const [result] = await mysql.query(
    `INSERT INTO payment (from_user, value)
    VALUES (?, ?)`,
    [from_user, value],
  );
  return result;
}


module.exports = { getPayments, payBill };
