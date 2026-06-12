// ============================================================
// models/Reserva.js — Histórico de interesse / aluguéis
// ============================================================
const db = require('../config/db');

class Reserva {

    static async listarTodas() {
        const [rows] = await db.execute(
            `SELECT r.*, e.modelo, e.tipo, u.username AS usuario_username
             FROM reservas r
             JOIN embarcacoes e ON e.id = r.embarcacao_id
             LEFT JOIN usuarios u ON u.id = r.usuario_id
             ORDER BY r.criado_em DESC`
        );
        return rows;
    }

    static async buscarPorId(id) {
        const [rows] = await db.execute(
            `SELECT r.*, e.modelo, e.tipo, u.username AS usuario_username
             FROM reservas r
             JOIN embarcacoes e ON e.id = r.embarcacao_id
             LEFT JOIN usuarios u ON u.id = r.usuario_id
             WHERE r.id = ?`,
            [id]
        );
        return rows[0] || null;
    }

    /** Lista as solicitações de aluguel feitas por um usuário específico */
    static async listarPorUsuario(usuario_id) {
        const [rows] = await db.execute(
            `SELECT r.*, e.modelo, e.tipo
             FROM reservas r
             JOIN embarcacoes e ON e.id = r.embarcacao_id
             WHERE r.usuario_id = ?
             ORDER BY r.criado_em DESC`,
            [usuario_id]
        );
        return rows;
    }

    /**
     * Cria um registro de interesse OU aluguel.
     * dados = {
     *   embarcacao_id, cliente_nome, cliente_telefone,
     *   forma_pagamento, data_inicio, data_fim, dias, valor_total,
     *   tipo_solicitacao, usuario_id, status
     * }
     */
    static async criar(dados) {
        const {
            embarcacao_id,
            cliente_nome,
            cliente_telefone,
            forma_pagamento  = null,
            data_inicio      = null,
            data_fim         = null,
            dias             = null,
            valor_total      = null,
            tipo_solicitacao = 'interesse',
            usuario_id       = null,
            status           = 'pendente'
        } = dados;

        const [r] = await db.execute(
            `INSERT INTO reservas
             (embarcacao_id, cliente_nome, cliente_telefone,
              forma_pagamento, data_inicio, data_fim, dias, valor_total,
              tipo_solicitacao, usuario_id, status)
             VALUES (?,?,?,?,?,?,?,?,?,?,?)`,
            [embarcacao_id, cliente_nome, cliente_telefone,
             forma_pagamento, data_inicio, data_fim, dias, valor_total,
             tipo_solicitacao, usuario_id, status]
        );
        return r.insertId;
    }

    /**
     * Atualiza o status da solicitação (aprovado / rejeitado),
     * registrando o motivo (obrigatório em caso de rejeição).
     */
    static async atualizarStatus(id, status, motivo_recusa = null) {
        await db.execute(
            'UPDATE reservas SET status = ?, motivo_recusa = ?, respondido_em = NOW() WHERE id = ?',
            [status, motivo_recusa, id]
        );
    }

    static async deletar(id) {
        await db.execute('DELETE FROM reservas WHERE id=?', [id]);
    }
}

module.exports = Reserva;
