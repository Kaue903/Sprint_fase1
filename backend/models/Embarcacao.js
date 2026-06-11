// ============================================================
// models/Embarcacao.js — Model que representa uma embarcação
// ============================================================
const db = require('../config/db');

class Embarcacao {

    constructor(data) {
        Object.assign(this, data);
    }

    /** Retorna true se disponível para aluguel */
    estaDisponivel() { return this.status === 'Disponível'; }

    /** Preço formatado em R$ */
    precoFormatado() {
        return `R$ ${parseFloat(this.preco_diaria).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
    }

    // ── MÉTODOS ESTÁTICOS ─────────────────────────────────────

    /** Todos os registros (admin) */
    static async listarTodos() {
        const [rows] = await db.execute('SELECT * FROM embarcacoes ORDER BY id DESC');
        return rows;
    }

    /** Apenas disponíveis (site público) */
    static async listarDisponiveis() {
        const [rows] = await db.execute(
            "SELECT * FROM embarcacoes WHERE status = 'Disponível' ORDER BY tipo, modelo"
        );
        return rows;
    }

    /** Filtra por tipo (Iate / Jet Ski / Lancha) */
    static async listarPorTipo(tipo) {
        const [rows] = await db.execute(
            'SELECT * FROM embarcacoes WHERE tipo = ? ORDER BY modelo', [tipo]
        );
        return rows;
    }

    /** Busca por ID */
    static async buscarPorId(id) {
        const [rows] = await db.execute('SELECT * FROM embarcacoes WHERE id = ?', [id]);
        return rows[0] || null;
    }

    /** Insere nova embarcação */
    static async adicionar(dados) {
        const { modelo, tipo, pessoas, ano_modelo, preco_diaria, preco_antigo,
                combustivel, incluso, status, destaque, imagem } = dados;
        const [r] = await db.execute(
            `INSERT INTO embarcacoes
             (modelo, tipo, pessoas, ano_modelo, preco_diaria, preco_antigo,
              combustivel, incluso, status, destaque, imagem)
             VALUES (?,?,?,?,?,?,?,?,?,?,?)`,
            [modelo, tipo, pessoas, ano_modelo, preco_diaria, preco_antigo || null,
             combustivel || null, incluso, status, destaque ? 1 : 0, imagem || null]
        );
        return r.insertId;
    }

    /** Atualiza embarcação — preserva imagem se não enviada */
    static async editar(id, dados) {
        const { modelo, tipo, pessoas, ano_modelo, preco_diaria, preco_antigo,
                combustivel, incluso, status, destaque, imagem } = dados;
        if (imagem) {
            await db.execute(
                `UPDATE embarcacoes SET modelo=?,tipo=?,pessoas=?,ano_modelo=?,
                 preco_diaria=?,preco_antigo=?,combustivel=?,incluso=?,status=?,
                 destaque=?,imagem=? WHERE id=?`,
                [modelo, tipo, pessoas, ano_modelo, preco_diaria, preco_antigo || null,
                 combustivel || null, incluso, status, destaque ? 1 : 0, imagem, id]
            );
        } else {
            await db.execute(
                `UPDATE embarcacoes SET modelo=?,tipo=?,pessoas=?,ano_modelo=?,
                 preco_diaria=?,preco_antigo=?,combustivel=?,incluso=?,status=?,
                 destaque=? WHERE id=?`,
                [modelo, tipo, pessoas, ano_modelo, preco_diaria, preco_antigo || null,
                 combustivel || null, incluso, status, destaque ? 1 : 0, id]
            );
        }
    }

    /** Alterna Disponível ↔ Alugado */
    static async alterarStatus(id, novoStatus) {
        await db.execute('UPDATE embarcacoes SET status=? WHERE id=?', [novoStatus, id]);
    }

    /** Remove permanentemente */
    static async deletar(id) {
        await db.execute('DELETE FROM embarcacoes WHERE id=?', [id]);
    }

    /** Estatísticas para os cards do painel */
    static async estatisticas() {
        const [[total]]      = await db.execute('SELECT COUNT(*) AS v FROM embarcacoes');
        const [[disp]]       = await db.execute("SELECT COUNT(*) AS v FROM embarcacoes WHERE status='Disponível'");
        const [[alug]]       = await db.execute("SELECT COUNT(*) AS v FROM embarcacoes WHERE status='Alugado'");
        const [[iates]]      = await db.execute("SELECT COUNT(*) AS v FROM embarcacoes WHERE tipo='Iate'");
        const [[jets]]       = await db.execute("SELECT COUNT(*) AS v FROM embarcacoes WHERE tipo='Jet Ski'");
        const [[lanchas]]    = await db.execute("SELECT COUNT(*) AS v FROM embarcacoes WHERE tipo='Lancha'");
        const [[reservas]]   = await db.execute('SELECT COUNT(*) AS v FROM reservas');
        return {
            total:    total.v,
            disp:     disp.v,
            alug:     alug.v,
            iates:    iates.v,
            jets:     jets.v,
            lanchas:  lanchas.v,
            reservas: reservas.v
        };
    }
}

module.exports = Embarcacao;
