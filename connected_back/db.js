const mysql = require('mysql2');
require("dotenv").config();

// console.log(process.env.NODE_ENV, "!!!!!!!!!!!!!!");
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.NODE_ENV == "test" ? process.env.DB_DATABASE_TEST : process.env.DB_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

module.exports = pool;