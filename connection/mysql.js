const db = require('mysql2/promise');

const mysql = db.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PW,
  database: 'iron_bank_api',
})

module.exports = mysql;