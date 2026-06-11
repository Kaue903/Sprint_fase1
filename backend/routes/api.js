// ============================================================
// routes/api.js — Todas as rotas REST do Wave Club
// ============================================================
const express = require('express');
const router  = express.Router();

const AuthController        = require('../controllers/AuthController');
const EmbarcacaoController  = require('../controllers/EmbarcacaoController');
const ReservaController     = require('../controllers/ReservaController');

const { autenticado, apenasAdmin } = require('../middleware/auth');
const { uploadComTratamento }      = require('../config/upload');

// ── AUTENTICAÇÃO ──────────────────────────────────────────────
router.post('/login',  AuthController.login);
router.post('/logout', autenticado, AuthController.logout);
router.get('/sessao',  autenticado, AuthController.verificarSessao);

// ── PÚBLICAS ──────────────────────────────────────────────────
router.get('/public/embarcacoes', EmbarcacaoController.listarPublico);
router.post('/public/reservas',   ReservaController.criar);

// ── AUTENTICADAS ──────────────────────────────────────────────
router.get('/embarcacoes',     autenticado, EmbarcacaoController.listar);
router.get('/embarcacoes/:id', autenticado, EmbarcacaoController.buscarUm);

// ── ADMIN — escrita ───────────────────────────────────────────
router.post('/embarcacoes',
    autenticado, apenasAdmin,
    uploadComTratamento('imagem'),
    EmbarcacaoController.adicionar);

router.put('/embarcacoes/:id',
    autenticado, apenasAdmin,
    uploadComTratamento('imagem'),
    EmbarcacaoController.editar);

router.put('/embarcacoes/:id/status',
    autenticado, apenasAdmin,
    EmbarcacaoController.alterarStatus);

router.delete('/embarcacoes/:id',
    autenticado, apenasAdmin,
    EmbarcacaoController.deletar);

// ── ADMIN — painel ────────────────────────────────────────────
router.get('/admin/estatisticas', autenticado, apenasAdmin, EmbarcacaoController.estatisticas);
router.get('/admin/reservas',     autenticado, apenasAdmin, ReservaController.listar);
router.delete('/admin/reservas/:id', autenticado, apenasAdmin, ReservaController.deletar);

module.exports = router;
