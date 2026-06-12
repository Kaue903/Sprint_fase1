// ============================================================
// server.js — Servidor principal Express do Wave Club
// ============================================================
require('dotenv').config();
const express = require('express');
const session = require('express-session');
const cors    = require('cors');
const path    = require('path');

const apiRoutes = require('./routes/api');
const app  = express();
const PORT = process.env.PORT || 3001;

const allowedOrigin = process.env.APP_URL || `http://localhost:${PORT}`;

app.set('trust proxy', 1); // necessário no Render (proxy reverso)

app.use(cors({ origin: allowedOrigin, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret:            process.env.SESSION_SECRET || 'waveclub_secret',
    resave:            false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure:   process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge:   1000 * 60 * 60 * 8
    }
}));

// ── Estáticos ─────────────────────────────────────────────────
app.use('/css',     express.static(path.join(__dirname, '../frontend/css')));
app.use('/js',      express.static(path.join(__dirname, '../frontend/js')));
app.use('/assets',  express.static(path.join(__dirname, '../frontend/assets')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── API ───────────────────────────────────────────────────────
app.use('/api', apiRoutes);

// ── Páginas HTML ──────────────────────────────────────────────
app.get('/',          (req, res) => res.sendFile(path.join(__dirname, '../frontend/views/index.html')));
app.get('/login',     (req, res) => res.sendFile(path.join(__dirname, '../frontend/views/login.html')));
app.get('/dashboard', (req, res) => res.sendFile(path.join(__dirname, '../frontend/views/dashboard.html')));
app.get('/painel',    (req, res) => res.sendFile(path.join(__dirname, '../frontend/views/painel-usuario.html')));

// ── Erros globais ─────────────────────────────────────────────
app.use((err, req, res, next) => {
    console.error('Erro:', err.message);
    if (res.headersSent) return next(err);
    res.status(err.status || 500).json({ erro: err.message || 'Erro interno.' });
});

app.listen(PORT, () => {
    console.log(`\n⚓  WAVE CLUB — Servidor iniciado`);
    console.log(`🌐  http://localhost:${PORT}/\n`);
});
