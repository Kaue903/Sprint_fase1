-- ============================================================
-- WAVE CLUB — Script de criação do banco de dados (CORRIGIDO)
-- Execute no MySQL Workbench antes de iniciar o servidor.
-- ============================================================

DROP DATABASE IF EXISTS waveclub_db;

CREATE DATABASE waveclub_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE waveclub_db;

-- ============================================================
-- TABELA DE USUÁRIOS
-- ============================================================
CREATE TABLE IF NOT EXISTS usuarios (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    username   VARCHAR(50)  NOT NULL UNIQUE,
    password   VARCHAR(255) NOT NULL,
    role       ENUM('admin','usuario') NOT NULL DEFAULT 'usuario',
    criado_em  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- TABELA DE EMBARCAÇÕES
-- ============================================================
CREATE TABLE IF NOT EXISTS embarcacoes (
    id           INT AUTO_INCREMENT PRIMARY KEY,
    modelo       VARCHAR(150)  NOT NULL,
    tipo         ENUM('Iate','Jet Ski','Lancha') NOT NULL,
    pessoas      VARCHAR(50)   NOT NULL,
    ano_modelo   INT           NOT NULL,
    preco_diaria DECIMAL(10,2) NOT NULL,
    preco_antigo DECIMAL(10,2) DEFAULT NULL,
    combustivel  VARCHAR(100)  DEFAULT NULL,
    incluso      TEXT          NOT NULL,
    status       ENUM('Disponível','Alugado') NOT NULL DEFAULT 'Disponível',
    destaque     TINYINT(1)    DEFAULT 0,
    imagem       VARCHAR(255)  DEFAULT NULL,
    criado_em    TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- TABELA DE RESERVAS — versão completa com todos os campos
-- ============================================================
CREATE TABLE IF NOT EXISTS reservas (
    id               INT AUTO_INCREMENT PRIMARY KEY,
    embarcacao_id    INT          NOT NULL,
    cliente_nome     VARCHAR(100) NOT NULL,
    cliente_telefone VARCHAR(20)  NOT NULL,
    usuario_id       INT          NULL,
    forma_pagamento  ENUM('Pix','Cartão de Crédito','Cartão de Débito','Boleto','Dinheiro') DEFAULT NULL,
    data_inicio      DATE         DEFAULT NULL,
    data_fim         DATE         DEFAULT NULL,
    dias             INT          DEFAULT NULL,
    valor_total      DECIMAL(10,2) DEFAULT NULL,
    tipo_solicitacao ENUM('interesse','aluguel') NOT NULL DEFAULT 'interesse',
    status           VARCHAR(20)  NOT NULL DEFAULT 'interesse',
    motivo_recusa    VARCHAR(255) NULL,
    respondido_em    DATETIME     NULL,
    criado_em        TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (embarcacao_id) REFERENCES embarcacoes(id) ON DELETE CASCADE,
    CONSTRAINT fk_reservas_usuario
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL
);

-- ============================================================
-- DADOS INICIAIS — Embarcações
-- ============================================================
INSERT INTO embarcacoes
  (modelo, tipo, pessoas, ano_modelo, preco_diaria, preco_antigo, combustivel, incluso, status, destaque, imagem)
VALUES
  ('HydraJet X',           'Jet Ski', '1 a 2',   2024, 2000.00,  2500.00, 'R$70–110/h',      'Limpeza e Manutenção',                              'Disponível', 1, 'Jet4.png'),
  ('Azimut 27 Metri',      'Iate',    'até 16',   2021, 15000.00, NULL,    'R$1.800–2.400/h', 'Suítes + jacuzzi',                                  'Disponível', 0, 'IATE2.png'),
  ('Proa Aberta',          'Lancha',  '5 a 8',    2023, 2500.00,  NULL,    'Incluso',         'Marinheiro',                                        'Disponível', 0, 'Lancha4.png'),
  ('Superyacht',           'Iate',    '10 a 16',  2020, 21000.00, NULL,    'Incluso',         'Jacuzzi, área gourmet, sistema de som premium',     'Alugado',    0, 'IATE3.png'),
  ('Kawasaki Ultra 310LX', 'Jet Ski', '2',        2025, 1300.00,  NULL,    'Incluso',         'Limpeza e manutenção',                              'Disponível', 0, 'Jet1.png'),
  ('Sea-Doo RXP-X 325',    'Jet Ski', '2',        2026, 1700.00,  NULL,    'Incluso',         'Seguranças e Manutenção',                           'Alugado',    0, 'Jet2.png'),
  ('Kawasaki Ultra 310R',  'Jet Ski', '2',        2020, 1200.00,  NULL,    'Incluso',         'Limpeza e Manutenção',                              'Disponível', 0, 'Jet3.png'),
  ('Real 280 Malou Blue',  'Lancha',  '13',       2022, 5000.00,  NULL,    'Incluso',         'Marinheiro, Kit de Segurança',                      'Disponível', 0, 'Lancha1.png'),
  ('Yacxo 357',            'Lancha',  '12',       2011, 5200.00,  NULL,    NULL,              'Ar-condicionado, cabines para 6 pessoas e cozinha', 'Disponível', 0, 'Lancha2.png');

-- ============================================================
-- DADOS INICIAIS — Reservas de exemplo
-- ============================================================
INSERT INTO reservas (embarcacao_id, cliente_nome, cliente_telefone, tipo_solicitacao, status, criado_em) VALUES
  (1, 'Carlos Mendes',  '(11) 98765-4321', 'interesse', 'interesse', '2026-05-10 14:00:00'),
  (2, 'Fernanda Lima',  '(21) 91234-5678', 'interesse', 'interesse', '2026-05-12 10:30:00'),
  (4, 'Roberto Souza',  '(11) 99887-6655', 'interesse', 'interesse', '2026-04-28 09:00:00'),
  (6, 'Aline Ferreira', '(11) 97654-3210', 'interesse', 'interesse', '2026-05-01 11:15:00');
