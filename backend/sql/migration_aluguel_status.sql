-- ============================================================
-- Migração: aprovação de pedidos de aluguel pelo admin
-- Execute este script no banco waveclub_db
-- ============================================================

ALTER TABLE reservas
  ADD COLUMN usuario_id     INT NULL AFTER cliente_telefone,
  ADD COLUMN status         VARCHAR(20) NOT NULL DEFAULT 'interesse' AFTER tipo_solicitacao,
  ADD COLUMN motivo_recusa  VARCHAR(255) NULL AFTER status,
  ADD COLUMN respondido_em  DATETIME NULL AFTER motivo_recusa,
  ADD CONSTRAINT fk_reservas_usuario
      FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
      ON DELETE SET NULL;

-- Reservas/interesses antigos de aluguel passam a status "pendente"
UPDATE reservas SET status = 'pendente' WHERE tipo_solicitacao = 'aluguel';
