const { getUser } = require('../model/user')
const {
  transferAmount, getTransactionInfo, flagTransaction, blockUser,
} = require('../model/transaction');

const prepareTransaction = async (cpf_token, cpf_body, value) => {
  const [dataSender] =  await getUser(cpf_token);
  const [dataReceiver] =  await getUser(cpf_body);
  const idSender = dataSender.id_user;
  const idReceiver = dataReceiver.id_user;
  const data = await transferAmount(idSender, idReceiver, value);
  return data;
};

const flagFraud = async (transactionId) => {
  const [transaction] = await getTransactionInfo(transactionId);
  const flag = await flagTransaction(transactionId);
  const block = await blockUser(transaction.to_user);
  return {
    flag,
    block
  };
};

module.exports = { prepareTransaction, flagFraud };
