# 🚀 Deploy Wave Club — Render + Railway (banco)

## Arquivos que precisam ser substituídos no projeto

| Arquivo no seu projeto                          | Arquivo deste ZIP                              |
|-------------------------------------------------|------------------------------------------------|
| `backend/server.js`                             | `backend/server.js`                            |
| `backend/config/db.js`                          | `backend/config/db.js`                         |
| `backend/controllers/ReservaController.js`      | `backend/controllers/ReservaController.js`     |
| `frontend/views/painel-usuario.html`            | `frontend/views/painel-usuario.html`           |
| _(novo)_ `.gitignore`                           | `.gitignore`                                   |
| _(novo)_ `render.yaml`                          | `render.yaml`                                  |

---

## Passo 1 — Criar o banco MySQL no Railway

1. Acesse [railway.app](https://railway.app) → **New Project → Database → MySQL**
2. Clique no banco criado → aba **Query** → cole e execute o `banco_de_dados.sql`
3. Ainda na aba **Connect**, anote as variáveis:
   - `MYSQL_HOST` → seu `DB_HOST`
   - `MYSQL_PORT` → seu `DB_PORT`
   - `MYSQL_USER` → seu `DB_USER`
   - `MYSQL_PASSWORD` → seu `DB_PASSWORD`
   - `MYSQL_DATABASE` → seu `DB_NAME`

---

## Passo 2 — Subir o código para o GitHub

```bash
git init
git add .
git commit -m "deploy wave club"
git branch -M main
git remote add origin https://github.com/seu-usuario/wave-club.git
git push -u origin main
```

---

## Passo 3 — Criar o serviço no Render

1. Acesse [render.com](https://render.com) → **New → Web Service**
2. Conecte sua conta GitHub e selecione o repositório
3. Render detecta o `render.yaml` automaticamente
4. Clique em **Create Web Service**

---

## Passo 4 — Configurar as variáveis no Render

Vá em **Environment → Add Environment Variable** e adicione:

| Chave          | Valor                                      |
|----------------|--------------------------------------------|
| `NODE_ENV`     | `production`                               |
| `SESSION_SECRET` | (qualquer string longa e aleatória)      |
| `APP_URL`      | `https://wave-club.onrender.com`           |
| `DB_HOST`      | valor do Railway (`MYSQL_HOST`)            |
| `DB_PORT`      | valor do Railway (`MYSQL_PORT`)            |
| `DB_USER`      | valor do Railway (`MYSQL_USER`)            |
| `DB_PASSWORD`  | valor do Railway (`MYSQL_PASSWORD`)        |
| `DB_NAME`      | valor do Railway (`MYSQL_DATABASE`)        |
| `DB_SSL`       | `true`                                     |

> **APP_URL**: copie a URL gerada pelo Render após o primeiro deploy e atualize essa variável.

---

## Passo 5 — Criar os usuários (seed)

No Render → seu serviço → **Shell**, execute:

```bash
node backend/seed.js
```

Usuários criados:
- `admin` / `admin123`
- `usuario` / `user123`

---

## ⚠️ Observações

- O Render no plano gratuito **hiberna após 15 min** sem acesso — a primeira requisição pode demorar ~30s para acordar. No plano pago isso não ocorre.
- Uploads de imagem são temporários no Render (sistema de arquivos reinicia a cada deploy). Para produção real, use Cloudinary.
- Troque as senhas padrão após o primeiro acesso.
