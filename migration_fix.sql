-- ============================================================
-- WAVE CLUB — Migration corretiva
-- Use este script SE você já tem o banco criado e não quer
-- recriar do zero. Execute no MySQL Workbench.
-- ============================================================

USE waveclub_db;

-- 1. Remove a coluna status antiga (ENUM errado) e recria como VARCHAR
ALTER TABLE reservas MODIFY COLUMN status VARCHAR(20) NOT NULL DEFAULT 'interesse';

-- 2. Adiciona colunas que a migration anterior falhou em criar
--    (ignora erro se já existirem)
ALTER TABLE reservas
  ADD COLUMN IF NOT EXISTS usuario_id    INT          NULL          AFTER cliente_telefone,
  ADD COLUMN IF NOT EXISTS motivo_recusa VARCHAR(255) NULL          AFTER status,
  ADD COLUMN IF NOT EXISTS respondido_em DATETIME     NULL          AFTER motivo_recusa;

-- 3. Adiciona FK de usuario_id se ainda não existir
SET @fk_exists = (
  SELECT COUNT(*) FROM information_schema.TABLE_CONSTRAINTS
  WHERE CONSTRAINT_SCHEMA = 'waveclub_db'
    AND TABLE_NAME = 'reservas'
    AND CONSTRAINT_NAME = 'fk_reservas_usuario'
);
SET @sql = IF(@fk_exists = 0,
  'ALTER TABLE reservas ADD CONSTRAINT fk_reservas_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL',
  'SELECT "FK já existe"'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- 4. Corrige status das reservas de exemplo que ficaram com valor antigo
UPDATE reservas SET status = 'interesse' WHERE status IN ('Pendente','Confirmada','Cancelada');
