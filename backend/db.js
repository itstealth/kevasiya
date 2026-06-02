const mysql = require("mysql2/promise");
require("dotenv").config(); // Load environment variables

// Read database configuration from environment variables
const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

const pool = mysql.createPool(dbConfig);

module.exports = pool;
