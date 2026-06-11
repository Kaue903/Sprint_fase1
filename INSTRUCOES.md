# ⚓ WAVE CLUB — Guia de Instalação e Uso

---

## Estrutura do Projeto

```
wave-club/
│
├── banco_de_dados.sql              ← Execute PRIMEIRO no MySQL
│
├── backend/
│   ├── server.js                   ← Servidor Express
│   ├── seed.js                     ← Cria usuários iniciais
│   ├── package.json
│   ├── .env                        ← Credenciais (EDITE ANTES DE RODAR)
│   │
│   ├── config/
│   │   ├── db.js                   ← Pool MySQL
│   │   └── upload.js               ← Multer (upload de fotos)
│   │
│   ├── models/
│   │   ├── Embarcacao.js           ← CRUD + estatísticas
│   │   ├── Usuario.js              ← Autenticação bcrypt
│   │   └── Reserva.js              ← Histórico de interesse
│   │
│   ├── controllers/
│   │   ├── AuthController.js
│   │   ├── EmbarcacaoController.js
│   │   └── ReservaController.js
│   │
│   ├── middleware/
│   │   └── auth.js                 ← autenticado / apenasAdmin
│   │
│   └── routes/
│       └── api.js                  ← Todas as rotas REST
│
├── frontend/
│   ├── assets/img/                 ← Imagens originais do projeto
│   ├── css/                        ← CSS original preservado
│   └── views/
│       ├── index.html              ← Site público (catálogo dinâmico)
│       ├── login.html              ← Tela de login
│       ├── dashboard.html          ← Painel Admin (CRUD completo)
│       └── painel-usuario.html     ← Painel Usuário (visualização)
│
└── uploads/                        ← Fotos enviadas pelo admin
```

---

## Instalação Passo a Passo

### 1. Banco de Dados
Abra o MySQL Workbench e execute o arquivo `banco_de_dados.sql`.
Isso cria o banco `waveclub_db` com 9 embarcações e 4 reservas de exemplo.

### 2. Configurar .env
Edite `backend/.env`:
```env
PORT=3001
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=SUA_SENHA_AQUI
DB_NAME=waveclub_db
SESSION_SECRET=waveclub_secret_2024
```

### 3. Instalar dependências
```bash
cd backend
npm install
```

### 4. Criar usuários
```bash
node seed.js
```

### 5. Iniciar servidor
```bash
npm run dev
```

Acesse: **http://localhost:3001**

---

## Credenciais

| Usuário  | Senha    | Perfil  | Acesso |
|---------|---------|--------|--------|
| admin   | admin123 | Admin  | CRUD completo |
| usuario | user123  | Usuário | Somente visualização |

---

## Funcionalidades

### Visitante (sem login)
- Catálogo com filtros por tipo e status
- Modal de interesse — registra nome e telefone no banco
- Avaliações e seção sobre

### Usuário logado (/painel)
- Catálogo completo com filtros
- Cards com destaques ("Exclusivo")
- Modal para registrar interesse

### Admin (/dashboard)
- Cards de estatísticas em tempo real
- Cadastrar / editar / excluir embarcações
- Upload de foto ou URL externa
- Alternar status Disponível ↔ Alugado com 1 clique
- Simulador de orçamento
- Histórico de reservas/interesses com exclusão

---

## Rotas da API

| Método | Rota | Acesso |
|--------|------|--------|
| POST | /api/login | Público |
| POST | /api/logout | Autenticado |
| GET | /api/sessao | Autenticado |
| GET | /api/public/embarcacoes | Público |
| POST | /api/public/reservas | Público |
| GET | /api/embarcacoes | Autenticado |
| GET | /api/embarcacoes/:id | Autenticado |
| POST | /api/embarcacoes | Admin |
| PUT | /api/embarcacoes/:id | Admin |
| PUT | /api/embarcacoes/:id/status | Admin |
| DELETE | /api/embarcacoes/:id | Admin |
| GET | /api/admin/estatisticas | Admin |
| GET | /api/admin/reservas | Admin |
| DELETE | /api/admin/reservas/:id | Admin |
