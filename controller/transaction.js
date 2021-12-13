const router = require('express').Router();
const { auth } = require('../middleware/auth');
const { StatusCodes } = require('http-status-codes');
const { getTransactions } = require('../model/transaction');
const { prepareTransaction, flagFraud } = require('../service/transaction');
const { adminCheck, selfCheck, transferCheck, blockedCheck } = require('../middleware/validation');

router.get('/', auth, adminCheck, async (req, res, next) => {
  try {
    const data = await getTransactions();
    return res.status(StatusCodes.OK).send(data);
  } catch (err) {
    return next(err);
  }
});

router.get('/:cpf', auth, selfCheck, async (req, res, next) => {
  try {
    const { cpf } = req.params;
    const data = await getTransactions(cpf);
    return res.status(StatusCodes.OK).send(data);
  } catch (err) {
    return next(err);
  }
});

router.post('/', auth, transferCheck, blockedCheck, async (req, res, next) => {
  try {
    const { cpf: cpf_token } = req.user;
    const { receiver: cpf_body, value } = req.body;
    const data = await prepareTransaction(cpf_token, cpf_body, value);
    if (data.affectedRows === 1) {
      return res.status(StatusCodes.CREATED).send({
        message: `Successfuly transfered BRL ${value} from ${cpf_token} to ${cpf_body}`,
      });
    }
    return res.status(StatusCodes.BAD_REQUEST).send({
      message: `Could not transfer BRL ${value} from ${cpf_token} to ${cpf_body}`,
    });
  } catch (err) {
    return next(err);
  }
});

router.put('/fraud/:id', auth, adminCheck, async (req, res, next) => {
  try {
    const { id: id_transaction } = req.params;
    const data = await flagFraud(id_transaction);
    if (data.flag.affectedRows === 1 && data.block.affectedRows === 1) {
      return res.status(StatusCodes.OK).send({
        message: `You've flagged transaction number ${id_transaction} as fraudulent, the receiver is now blocked.`,
      });
    }
    return res.status(StatusCodes.BAD_REQUEST).send({
      message: `Could not flag the transaction number ${id_transaction}.`,
    });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
