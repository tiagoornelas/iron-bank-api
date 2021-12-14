const db = require('mysql2/promise');

const mysql = db.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || '3306',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PW || 'admin',
  database: 'iron_bank_api',
})

module.exports = mysql;