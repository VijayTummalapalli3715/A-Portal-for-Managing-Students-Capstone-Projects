const mysql = require("mysql2");
require("dotenv").config();

// Create a connection to the database
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Promisify pool queries
const db = pool.promise();

module.exports = db;
