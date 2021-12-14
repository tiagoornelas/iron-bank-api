const dotenv = require('dotenv');
const express = require('express');

const error = require('./middleware/error');
// const { auth } = require('./middleware/auth');
const userRouter = require('./controller/user');
const loginRouter = require('./controller/login');
const profitRouter = require('./controller/profit');
const balanceRouter = require('./controller/balance');
const depositRouter = require('./controller/deposit');
const paymentRouter = require('./controller/payment');
const transactionRouter = require('./controller/transaction');

dotenv.config();
const app = express();

app.use(express.json());

app.use('/user', userRouter);
app.use('/login', loginRouter);
app.use('/profit', profitRouter);
app.use('/balance', balanceRouter);
app.use('/deposit', depositRouter);
app.use('/payment', paymentRouter);
app.use('/transaction', transactionRouter);

app.use(error);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Iron Bank API running on port ${PORT}`));

module.exports = app;
