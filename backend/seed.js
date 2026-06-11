// ============================================================
// seed.js — Cria usuários iniciais
// Execute: node seed.js
// ============================================================
require('dotenv').config();
const bcrypt = require('bcrypt');
const pool   = require('./config/db');

const usuarios = [
    { username: 'admin',   password: 'admin123', role: 'admin'   },
    { username: 'usuario', password: 'user123',  role: 'usuario' }
];

async function seed() {
    console.log('\n🌱  Criando usuários...\n');
    for (const u of usuarios) {
        const hash = await bcrypt.hash(u.password, 10);
        await pool.execute(
            `INSERT INTO usuarios (username,password,role) VALUES (?,?,?)
             ON DUPLICATE KEY UPDATE password=VALUES(password), role=VALUES(role)`,
            [u.username, hash, u.role]
        );
        console.log(`✅  ${u.username.padEnd(10)} (${u.role})`);
    }
    console.log('\n─────────────────────────────');
    console.log('👤  admin   / admin123  → painel completo');
    console.log('👤  usuario / user123   → somente visualização');
    console.log('─────────────────────────────\n');
    process.exit(0);
}

seed().catch(e => { console.error('❌', e.message); process.exit(1); });
