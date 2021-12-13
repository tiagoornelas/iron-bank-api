const router = require('express').Router();
const { auth } = require('../middleware/auth');
const { StatusCodes } = require('http-status-codes');
const { getTransactions } = require('../model/transaction');
const { prepareTransaction } = require('../service/transaction');
const { adminCheck, selfCheck, transferCheck } = require('../middleware/validation');

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

router.post('/', auth, transferCheck, async (req, res, next) => {
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

module.exports = router;
