// ============================================================
// controllers/EmbarcacaoController.js — CRUD + estatísticas
// ============================================================
const Embarcacao = require('../models/Embarcacao');

class EmbarcacaoController {

    // GET /api/public/embarcacoes — site público
    static async listarPublico(req, res) {
        try {
            const lista = await Embarcacao.listarTodos(); // mostra todas (com badge alugado)
            return res.json(lista);
        } catch (e) {
            return res.status(500).json({ erro: 'Erro ao carregar catálogo.' });
        }
    }

    // GET /api/embarcacoes — autenticado
    static async listar(req, res) {
        try {
            return res.json(await Embarcacao.listarTodos());
        } catch (e) {
            return res.status(500).json({ erro: 'Erro ao listar.' });
        }
    }

    // GET /api/embarcacoes/:id
    static async buscarUm(req, res) {
        try {
            const e = await Embarcacao.buscarPorId(req.params.id);
            if (!e) return res.status(404).json({ erro: 'Não encontrada.' });
            return res.json(e);
        } catch (e) {
            return res.status(500).json({ erro: 'Erro ao buscar.' });
        }
    }

    // POST /api/embarcacoes — admin
    static async adicionar(req, res) {
        if (req.fileValidationError)
            return res.status(400).json({ erro: req.fileValidationError });

        const { modelo, tipo, pessoas, ano_modelo, preco_diaria, preco_antigo,
                combustivel, incluso, status, destaque, imagemUrl } = req.body;

        if (!modelo || !tipo || !pessoas || !ano_modelo || !preco_diaria || !incluso || !status)
            return res.status(400).json({ erro: 'Preencha todos os campos obrigatórios.' });

        const imagem = req.file ? req.file.filename : (imagemUrl || null);

        try {
            const id = await Embarcacao.adicionar({
                modelo, tipo, pessoas, ano_modelo, preco_diaria,
                preco_antigo: preco_antigo || null,
                combustivel:  combustivel  || null,
                incluso, status,
                destaque: destaque === '1' || destaque === true,
                imagem
            });
            return res.status(201).json({ mensagem: 'Embarcação cadastrada!', id });
        } catch (e) {
            console.error(e);
            return res.status(500).json({ erro: 'Erro ao cadastrar.' });
        }
    }

    // PUT /api/embarcacoes/:id — admin
    static async editar(req, res) {
        if (req.fileValidationError)
            return res.status(400).json({ erro: req.fileValidationError });

        const { modelo, tipo, pessoas, ano_modelo, preco_diaria, preco_antigo,
                combustivel, incluso, status, destaque, imagemUrl } = req.body;

        if (!modelo || !tipo || !pessoas || !ano_modelo || !preco_diaria || !incluso || !status)
            return res.status(400).json({ erro: 'Preencha todos os campos obrigatórios.' });

        const imagem = req.file ? req.file.filename : (imagemUrl || null);

        try {
            await Embarcacao.editar(req.params.id, {
                modelo, tipo, pessoas, ano_modelo, preco_diaria,
                preco_antigo: preco_antigo || null,
                combustivel:  combustivel  || null,
                incluso, status,
                destaque: destaque === '1' || destaque === true,
                imagem
            });
            return res.json({ mensagem: 'Embarcação atualizada!' });
        } catch (e) {
            return res.status(500).json({ erro: 'Erro ao atualizar.' });
        }
    }

    // PUT /api/embarcacoes/:id/status — admin
    static async alterarStatus(req, res) {
        try {
            const e = await Embarcacao.buscarPorId(req.params.id);
            if (!e) return res.status(404).json({ erro: 'Não encontrada.' });
            const novo = e.status === 'Disponível' ? 'Alugado' : 'Disponível';
            await Embarcacao.alterarStatus(req.params.id, novo);
            return res.json({ mensagem: `Status alterado para ${novo}!`, status: novo });
        } catch (e) {
            return res.status(500).json({ erro: 'Erro ao alterar status.' });
        }
    }

    // DELETE /api/embarcacoes/:id — admin
    static async deletar(req, res) {
        try {
            await Embarcacao.deletar(req.params.id);
            return res.json({ mensagem: 'Embarcação removida.' });
        } catch (e) {
            return res.status(500).json({ erro: 'Erro ao remover.' });
        }
    }

    // GET /api/admin/estatisticas
    static async estatisticas(req, res) {
        try {
            return res.json(await Embarcacao.estatisticas());
        } catch (e) {
            return res.status(500).json({ erro: 'Erro ao buscar estatísticas.' });
        }
    }
}

module.exports = EmbarcacaoController;
