// ============================================================
// models/Reserva.js — Histórico de interesse / reservas
// ============================================================
const db = require('../config/db');

class Reserva {

    static async listarTodas() {
        const [rows] = await db.execute(
            `SELECT r.*, e.modelo, e.tipo
             FROM reservas r
             JOIN embarcacoes e ON e.id = r.embarcacao_id
             ORDER BY r.criado_em DESC`
        );
        return rows;
    }

    static async criar(embarcacao_id, cliente_nome, cliente_telefone) {
        const [r] = await db.execute(
            'INSERT INTO reservas (embarcacao_id,cliente_nome,cliente_telefone) VALUES (?,?,?)',
            [embarcacao_id, cliente_nome, cliente_telefone]
        );
        return r.insertId;
    }

    static async deletar(id) {
        await db.execute('DELETE FROM reservas WHERE id=?', [id]);
    }
}

module.exports = Reserva;
