// ============================================================
// models/Usuario.js — Autenticação com bcrypt
// ============================================================
const db     = require('../config/db');
const bcrypt = require('bcrypt');

class Usuario {

    constructor(id, username, role) {
        this.id = id; this.username = username; this.role = role;
    }

    isAdmin() { return this.role === 'admin'; }

    static async autenticar(username, senha) {
        const [rows] = await db.execute('SELECT * FROM usuarios WHERE username=?', [username]);
        if (!rows.length) return null;
        const u  = rows[0];
        const ok = await bcrypt.compare(senha, u.password);
        return ok ? new Usuario(u.id, u.username, u.role) : null;
    }

    static async criar(username, senha, role = 'usuario') {
        const hash = await bcrypt.hash(senha, 10);
        const [r]  = await db.execute(
            'INSERT INTO usuarios (username,password,role) VALUES (?,?,?)',
            [username, hash, role]
        );
        return r.insertId;
    }

    static async listarTodos() {
        const [rows] = await db.execute(
            'SELECT id,username,role,criado_em FROM usuarios ORDER BY id'
        );
        return rows;
    }
}

module.exports = Usuario;
