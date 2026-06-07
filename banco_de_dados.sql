DROP DATABASE IF EXISTS locadora_db;
CREATE DATABASE locadora_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE locadora_db;

CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'usuario') NOT NULL
);

CREATE TABLE IF NOT EXISTS veiculos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tipo ENUM('Carro', 'Moto') NOT NULL,
    modelo VARCHAR(100) NOT NULL,
    placa VARCHAR(20) NOT NULL UNIQUE,
    status ENUM('Disponível', 'Alugado') DEFAULT 'Disponível',
    imagem VARCHAR(255) DEFAULT 'default.png'
);

INSERT INTO veiculos (tipo, modelo, placa, status) VALUES
  ('Carro', 'Sandero', 'FMA-6680', 'Disponível'),
  ('Moto',  'Ninja',   'FMA-6600', 'Alugado'),
  ('Carro', 'Onix',    'ABC-1234', 'Disponível');
```