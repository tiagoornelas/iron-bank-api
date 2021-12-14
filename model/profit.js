const mysql = require('../connection/mysql');

const getProfit = async () => {
  const [result] = await mysql.query(
    `SELECT SUM(exchange_fee.exchange_fee_brl) AS profit
    FROM exchange_fee`,
  );
  return result;
};

module.exports = { getProfit };
