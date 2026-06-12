// ============================================================
// config/db.js — Pool de conexões MySQL
// Suporta DATABASE_URL (Railway) ou variáveis separadas
// ============================================================
require('dotenv').config();
const mysql = require('mysql2/promise');

let pool;

if (process.env.DATABASE_URL) {
    pool = mysql.createPool(process.env.DATABASE_URL);
} else {
    pool = mysql.createPool({
        host:               process.env.DB_HOST,
        port:               parseInt(process.env.DB_PORT || '3306', 10),
        user:               process.env.DB_USER,
        password:           process.env.DB_PASSWORD,
        database:           process.env.DB_NAME,
        ssl:                process.env.DB_SSL === 'true' ? { rejectUnauthorized: true } : false,
        waitForConnections: true,
        connectionLimit:    10,
        queueLimit:         0
    });
}

module.exports = pool;
