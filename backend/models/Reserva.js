// ============================================================
// models/Reserva.js — Histórico de interesse / aluguéis
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

    /**
     * Cria um registro de interesse OU aluguel.
     * dados = {
     *   embarcacao_id, cliente_nome, cliente_telefone,
     *   forma_pagamento, data_inicio, data_fim, dias, valor_total,
     *   tipo_solicitacao
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
            tipo_solicitacao = 'interesse'
        } = dados;

        const [r] = await db.execute(
            `INSERT INTO reservas
             (embarcacao_id, cliente_nome, cliente_telefone,
              forma_pagamento, data_inicio, data_fim, dias, valor_total, tipo_solicitacao)
             VALUES (?,?,?,?,?,?,?,?,?)`,
            [embarcacao_id, cliente_nome, cliente_telefone,
             forma_pagamento, data_inicio, data_fim, dias, valor_total, tipo_solicitacao]
        );
        return r.insertId;
    }

    static async deletar(id) {
        await db.execute('DELETE FROM reservas WHERE id=?', [id]);
    }
}

module.exports = Reserva;
