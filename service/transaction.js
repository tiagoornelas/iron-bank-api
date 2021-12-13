const { getUser } = require('../model/user')
const { transferAmount } = require('../model/transaction');

const prepareTransaction = async (cpf_token, cpf_body, value) => {
  const [dataSender] =  await getUser(cpf_token);
  const [dataReceiver] =  await getUser(cpf_body);
  const idSender = dataSender.id_user;
  const idReceiver = dataReceiver.id_user;
  const data = await transferAmount(idSender, idReceiver, value);
  return data;
};

module.exports = { prepareTransaction };
