const fetch = require('cross-fetch');

const { getUser } = require('../model/user')
const { chargeFee, depositUsdAmount, depositBrlAmount } = require('../model/deposit');


// usd_value, exchange_price, exchange_fee_brl
const prepareDeposit = async (cpf_body, value, currency) => {
  const [dataUser] = await getUser(cpf_body);
  if (currency === 'USD') {
    const response = await fetch('https://economia.awesomeapi.com.br/json/all');
    const { USD: dolar } = await response.json();
    const exchangeValue = value * dolar.ask;
    const { insertId } = await chargeFee(value, dolar.ask, exchangeValue * 0.1);
    const dataDeposit = await depositUsdAmount(dataUser.id_user, exchangeValue * 0.9, insertId);
    if (dataDeposit.affectedRows === 1) {
      return {
        depositValue: (exchangeValue * 0.9).toFixed(2),
        feeValue: (exchangeValue * 0.1).toFixed(2)
      }
    }
  }
  const data = await depositBrlAmount(dataUser.id_user, value);
  if (data.affectedRows === 1) {
    return {
      depositValue: value,
      feeValue: 0.00
    }
  }
};

module.exports = { prepareDeposit };
