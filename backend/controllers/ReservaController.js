// ============================================================
// controllers/ReservaController.js
// ============================================================
const Reserva    = require('../models/Reserva');
const Embarcacao = require('../models/Embarcacao');

class ReservaController {

    // POST /api/public/reservas
    // Aceita dois formatos:
    //  - "interesse": { embarcacao_id, cliente_nome, cliente_telefone }
    //  - "aluguel":   { embarcacao_id, cliente_nome, cliente_telefone,
    //                    forma_pagamento, data_inicio, data_fim, dias }
    static async criar(req, res) {
        const {
            embarcacao_id,
            cliente_nome,
            cliente_telefone,
            forma_pagamento,
            data_inicio,
            data_fim,
            dias
        } = req.body;

        if (!embarcacao_id || !cliente_nome || !cliente_telefone)
            return res.status(400).json({ erro: 'Preencha todos os campos.' });

        const ehAluguel = !!(forma_pagamento || data_inicio || data_fim || dias);

        let valor_total = null;
        let diasFinal   = dias ? parseInt(dias, 10) : null;

        if (ehAluguel) {
            if (!forma_pagamento || !data_inicio || !data_fim)
                return res.status(400).json({ erro: 'Preencha forma de pagamento e as datas do aluguel.' });

            const inicio = new Date(data_inicio);
            const fim    = new Date(data_fim);

            if (isNaN(inicio.getTime()) || isNaN(fim.getTime()) || fim < inicio)
                return res.status(400).json({ erro: 'Período de datas inválido.' });

            const diffMs = fim.getTime() - inicio.getTime();
            const diffDias = Math.max(1, Math.round(diffMs / (1000 * 60 * 60 * 24)) + 1);
            diasFinal = diasFinal || diffDias;

            const embarcacao = await Embarcacao.buscarPorId(embarcacao_id);
            if (!embarcacao) return res.status(404).json({ erro: 'Embarcação não encontrada.' });
            if (embarcacao.status !== 'Disponível')
                return res.status(409).json({ erro: 'Embarcação indisponível para aluguel no momento.' });

            valor_total = parseFloat(embarcacao.preco_diaria) * diasFinal;
        }

        try {
            const id = await Reserva.criar({
                embarcacao_id,
                cliente_nome,
                cliente_telefone,
                forma_pagamento:  forma_pagamento || null,
                data_inicio:      data_inicio     || null,
                data_fim:         data_fim        || null,
                dias:             diasFinal,
                valor_total,
                tipo_solicitacao: ehAluguel ? 'aluguel' : 'interesse'
            });

            const mensagem = ehAluguel
                ? 'Solicitação de aluguel registrada! Entraremos em contato para confirmar.'
                : 'Interesse registrado! Entraremos em contato.';

            return res.status(201).json({ mensagem, id, valor_total });
        } catch (e) {
            console.error('Erro ao criar reserva:', e);
            return res.status(500).json({ erro: 'Erro ao registrar solicitação.' });
        }
    }

    // GET /api/admin/reservas — admin
    static async listar(req, res) {
        try {
            return res.json(await Reserva.listarTodas());
        } catch (e) {
            return res.status(500).json({ erro: 'Erro ao listar reservas.' });
        }
    }

    // DELETE /api/admin/reservas/:id — admin
    static async deletar(req, res) {
        try {
            await Reserva.deletar(req.params.id);
            return res.json({ mensagem: 'Reserva removida.' });
        } catch (e) {
            return res.status(500).json({ erro: 'Erro ao remover.' });
        }
    }
}

module.exports = ReservaController;
