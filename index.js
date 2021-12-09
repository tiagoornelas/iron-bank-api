const express = require('express');
const dotenv = require('dotenv');

const loginRouter = require('./controller/login');

dotenv.config();
const app = express();

app.use(express.json());

app.use('/login', loginRouter)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Iron Bank API running on port ${PORT}`));

module.exports = app;
