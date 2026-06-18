# 🚀 Deploy Wave Club — Render + Railway (banco)

## Arquivos que precisam ser substituídos no projeto

| Arquivo no seu projeto                          | Arquivo deste ZIP                              |
|-------------------------------------------------|------------------------------------------------|
| `backend/server.js`                             | `backend/server.js`                            |
| `backend/config/db.js`                          | `backend/config/db.js`                         |
| `backend/controllers/ReservaController.js`      | `backend/controllers/ReservaController.js`     |
| `frontend/views/painel-usuario.html`            | `frontend/views/painel-usuario.html`           |
| `frontend/views/index.html`                     | `frontend/views/index.html` (mobile)           |
| `frontend/views/login.html`                     | `frontend/views/login.html` (mobile)           |
| `frontend/views/dashboard.html`                 | `frontend/views/dashboard.html` (mobile)       |
| _(novo)_ `frontend/css/mobile-*.css`             | 4 arquivos novos de responsividade             |
| _(novo)_ `.gitignore`                           | `.gitignore`                                   |
| _(novo)_ `render.yaml`                          | `render.yaml`                                  |

> Se você já tem o projeto num repositório Git, é mais simples eu te passar o `.zip` completo e você substituir a pasta toda — assim não corre risco de esquecer algum arquivo.

---

## ⚠️ Sobre custos (atualizado — jun/2026)

Vale alinhar a expectativa antes de começar:

- **Render (backend + frontend)**: o plano free ainda existe, sem cartão de crédito. Ele **hiberna depois de 15 min sem acesso** e demora ~1 min para "acordar" na próxima requisição. Para uma entrega de TCC/sprint isso é normal e aceitável.
- **Railway (banco MySQL)**: a Railway **não tem mais plano gratuito permanente**. Hoje funciona assim: ao criar a conta você recebe um trial único de 30 dias com US$5 em créditos; depois disso, o plano gratuito dá apenas US$1/mês de crédito — geralmente insuficiente para manter um banco MySQL ativo o tempo todo. Para manter o banco no ar de forma contínua depois do trial, o caminho realista é o plano Hobby (US$5/mês).

Para fins de entrega acadêmica isso não é problema (o trial de 30 dias cobre demonstrações e a banca), mas se a ideia é manter o Wave Club no ar por mais tempo sem custo, me avisa que posso te ajudar a adaptar o projeto para usar um banco gratuito alternativo (ex: Aiven for MySQL ou um Postgres gratuito do próprio Render, trocando a camada de acesso a dados).

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

## ⚠️ Observações finais

- Uploads de imagem são temporários no Render (sistema de arquivos reinicia a cada deploy/spin-down). Para produção real, use Cloudinary ou outro storage externo.
- Troque as senhas padrão (`admin123` / `user123`) após o primeiro acesso real.
- Se o Render "dormir" antes de uma apresentação, acesse a URL ~1 minuto antes para "acordar" o serviço.

