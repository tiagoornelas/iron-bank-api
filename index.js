const dotenv = require('dotenv');
const express = require('express');

const error = require('./middleware/error');
// const { auth } = require('./middleware/auth');
const userRouter = require('./controller/user');
const loginRouter = require('./controller/login');
const balanceRouter = require('./controller/balance');
const transactionRouter = require('./controller/transaction');

dotenv.config();
const app = express();

app.use(express.json());

app.use('/login', loginRouter);
app.use('/user', userRouter);
app.use('/balance', balanceRouter);
app.use('/transaction', transactionRouter);

app.use(error);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Iron Bank API running on port ${PORT}`));

module.exports = app;
