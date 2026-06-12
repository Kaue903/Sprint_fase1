// ============================================================
// controllers/ReservaController.js
// ============================================================
const Reserva    = require('../models/Reserva');
const Embarcacao = require('../models/Embarcacao');

class ReservaController {

    // POST /api/public/reservas (visitantes não logados)
    // Aceita dois formatos:
    //  - "interesse": { embarcacao_id, cliente_nome, cliente_telefone }
    //  - "aluguel":   { embarcacao_id, cliente_nome, cliente_telefone,
    //                    forma_pagamento, data_inicio, data_fim, dias }
    static async criar(req, res) {
        return ReservaController._criarInterno(req, res, null);
    }

    // POST /api/reservas (usuário autenticado solicitando aluguel)
    // O usuário logado é automaticamente vinculado ao pedido.
    static async criarAutenticada(req, res) {
        const usuario = req.session.usuario;
        return ReservaController._criarInterno(req, res, usuario.id);
    }

    static async _criarInterno(req, res, usuario_id) {
        const {
            cliente_nome,
            cliente_telefone,
            forma_pagamento,
            data_inicio,
            data_fim,
            dias
        } = req.body;

        // garante que embarcacao_id seja sempre número
        const embarcacao_id = parseInt(req.body.embarcacao_id, 10);

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

            const diffMs   = fim.getTime() - inicio.getTime();
            const diffDias = Math.max(1, Math.round(diffMs / (1000 * 60 * 60 * 24)) + 1);
            diasFinal = diasFinal || diffDias;

            let embarcacao;
            try {
                embarcacao = await Embarcacao.buscarPorId(embarcacao_id);
            } catch (e) {
                console.error('Erro ao buscar embarcação:', e);
                return res.status(500).json({ erro: 'Erro ao verificar embarcação.' });
            }

            if (!embarcacao)
                return res.status(404).json({ erro: 'Embarcação não encontrada.' });

            // compara sem acento para evitar problema de encoding no banco
            const statusNorm = (embarcacao.status || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
            if (statusNorm !== 'disponivel')
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
                tipo_solicitacao: ehAluguel ? 'aluguel' : 'interesse',
                usuario_id,
                status: ehAluguel ? 'pendente' : 'interesse'
            });

            const mensagem = ehAluguel
                ? 'Solicitação de aluguel enviada! Aguarde a autorização do administrador.'
                : 'Interesse registrado! Entraremos em contato.';

            return res.status(201).json({ mensagem, id, valor_total });
        } catch (e) {
            console.error('Erro ao criar reserva:', e);
            return res.status(500).json({ erro: 'Erro ao registrar solicitação.' });
        }
    }

    // GET /api/minhas-reservas — usuário autenticado vê seus próprios pedidos
    static async listarMinhas(req, res) {
        try {
            const usuario = req.session.usuario;
            return res.json(await Reserva.listarPorUsuario(usuario.id));
        } catch (e) {
            return res.status(500).json({ erro: 'Erro ao listar suas solicitações.' });
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

    // PUT /api/admin/reservas/:id/status — admin autoriza ou recusa o aluguel
    // body: { status: 'aprovado' | 'rejeitado', motivo? }
    static async atualizarStatus(req, res) {
        const { id } = req.params;
        const { status, motivo } = req.body;

        if (!['aprovado', 'rejeitado'].includes(status))
            return res.status(400).json({ erro: 'Status inválido. Use "aprovado" ou "rejeitado".' });

        if (status === 'rejeitado' && !motivo)
            return res.status(400).json({ erro: 'Informe o motivo da recusa.' });

        try {
            const reserva = await Reserva.buscarPorId(id);
            if (!reserva) return res.status(404).json({ erro: 'Solicitação não encontrada.' });

            await Reserva.atualizarStatus(id, status, status === 'rejeitado' ? motivo : null);

            // Se aprovado, marca a embarcação como Alugada
            if (status === 'aprovado') {
                await Embarcacao.alterarStatus(reserva.embarcacao_id, 'Alugado');
            }

            const mensagem = status === 'aprovado'
                ? 'Solicitação de aluguel aprovada.'
                : 'Solicitação de aluguel recusada.';

            return res.json({ mensagem });
        } catch (e) {
            console.error('Erro ao atualizar status da reserva:', e);
            return res.status(500).json({ erro: 'Erro ao atualizar solicitação.' });
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
