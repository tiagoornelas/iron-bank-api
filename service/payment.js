const { getUser } = require('../model/user')
const { payBill } = require('../model/payment');


// usd_value, exchange_price, exchange_fee_brl
const preparePayment = async (cpf_body, value) => {
  const [dataUser] = await getUser(cpf_body);
  const data = await payBill(dataUser.id_user, value);
  if (data.affectedRows === 1) {
    return data;
  }
};

module.exports = { preparePayment };
