// ============================================================
// middleware/auth.js — Proteção de rotas
// ============================================================
function autenticado(req, res, next) {
    if (req.session && req.session.usuario) return next();
    return res.status(401).json({ erro: 'Acesso negado. Faça login primeiro.' });
}

function apenasAdmin(req, res, next) {
    if (req.session.usuario && req.session.usuario.role === 'admin') return next();
    return res.status(403).json({ erro: 'Acesso proibido. Apenas administradores.' });
}

module.exports = { autenticado, apenasAdmin };
