// ============================================================
// controllers/AuthController.js
// ============================================================
const Usuario = require('../models/Usuario');

class AuthController {

    static async login(req, res) {
        const { username, password } = req.body;
        if (!username || !password)
            return res.status(400).json({ success: false, message: 'Informe usuário e senha.' });
        try {
            const usuario = await Usuario.autenticar(username, password);
            if (usuario) {
                req.session.usuario = { id: usuario.id, username: usuario.username, role: usuario.role };
                const redirectTo = usuario.isAdmin() ? '/dashboard' : '/painel';
                return res.json({ success: true, user: req.session.usuario, redirectTo });
            }
            return res.status(401).json({ success: false, message: 'Usuário ou senha incorretos.' });
        } catch (e) {
            console.error('Erro login:', e);
            return res.status(500).json({ success: false, message: 'Erro interno.' });
        }
    }

    static logout(req, res) {
        req.session.destroy(() => {
            res.clearCookie('connect.sid');
            return res.json({ success: true });
        });
    }

    static verificarSessao(req, res) {
        return res.json({ success: true, user: req.session.usuario });
    }
}

module.exports = AuthController;
