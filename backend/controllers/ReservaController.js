// ============================================================
// controllers/ReservaController.js
// ============================================================
const Reserva    = require('../models/Reserva');
const Embarcacao = require('../models/Embarcacao');

class ReservaController {

    // POST /api/public/reservas — visitante manifesta interesse
    static async criar(req, res) {
        const { embarcacao_id, cliente_nome, cliente_telefone } = req.body;
        if (!embarcacao_id || !cliente_nome || !cliente_telefone)
            return res.status(400).json({ erro: 'Preencha todos os campos.' });
        try {
            const id = await Reserva.criar(embarcacao_id, cliente_nome, cliente_telefone);
            return res.status(201).json({ mensagem: 'Interesse registrado! Entraremos em contato.', id });
        } catch (e) {
            return res.status(500).json({ erro: 'Erro ao registrar interesse.' });
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
