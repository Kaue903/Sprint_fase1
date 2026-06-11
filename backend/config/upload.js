// ============================================================
// config/upload.js — Multer para upload de fotos de embarcações
// Aceita: JPG, PNG, WEBP — até 5 MB
// Destino: pasta /uploads/ na raiz do projeto
// ============================================================
const multer = require('multer');
const path   = require('path');
const fs     = require('fs');

const storage = multer.diskStorage({
    destination(req, file, cb) {
        const dest = path.join(__dirname, '../../uploads');
        if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
        cb(null, dest);
    },
    filename(req, file, cb) {
        const ext    = path.extname(file.originalname).toLowerCase();
        const unique = Date.now() + '-' + Math.round(Math.random() * 1e9) + ext;
        cb(null, unique);
    }
});

const fileFilter = (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (allowed.includes(file.mimetype)) {
        cb(null, true);
    } else {
        req.fileValidationError = 'Formato inválido. Envie JPG, PNG ou WEBP.';
        cb(null, false);
    }
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });

function uploadComTratamento(campo) {
    return (req, res, next) => {
        upload.single(campo)(req, res, (err) => {
            if (err) {
                const msg = err.code === 'LIMIT_FILE_SIZE'
                    ? 'Arquivo muito grande. Máximo: 5 MB.'
                    : err.message || 'Erro no upload.';
                return res.status(400).json({ erro: msg });
            }
            next();
        });
    };
}

module.exports = { uploadComTratamento };
