// ============================================================
// config/db.js — Pool de conexões MySQL
// Suporta DATABASE_URL (Railway) ou variáveis separadas (.env)
// ============================================================
require('dotenv').config();
const mysql = require('mysql2/promise');

let pool;

if (process.env.DATABASE_URL) {
    // Railway fornece DATABASE_URL automaticamente
    pool = mysql.createPool(process.env.DATABASE_URL);
} else {
    pool = mysql.createPool({
        host:               process.env.DB_HOST,
        user:               process.env.DB_USER,
        password:           process.env.DB_PASSWORD,
        database:           process.env.DB_NAME,
        waitForConnections: true,
        connectionLimit:    10,
        queueLimit:         0
    });
}

module.exports = pool;
