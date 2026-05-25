-- Esquema SQLite do BXD Tattoo Studio
-- Aplicar: sqlite3 data/users.db < db/schema.sql

CREATE TABLE IF NOT EXISTS usuario (
  id_usuario INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  idade INTEGER,
  senha TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS adm (
  id_adm INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL,
  user TEXT NOT NULL UNIQUE,
  senha TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS servico (
  id_servico INTEGER PRIMARY KEY AUTOINCREMENT,
  tamanho TEXT NOT NULL,
  complexidade TEXT NOT NULL,
  cores TEXT NOT NULL,
  preco REAL NOT NULL
);

CREATE TABLE IF NOT EXISTS horario (
  id_horario INTEGER PRIMARY KEY AUTOINCREMENT,
  datetime TEXT NOT NULL,
  usuario_sk INTEGER,
  FOREIGN KEY (usuario_sk) REFERENCES usuario(id_usuario)
);

CREATE TABLE IF NOT EXISTS agendamento (
  id_agendamento INTEGER PRIMARY KEY AUTOINCREMENT,
  data TEXT,
  hora TEXT,
  usuario_sk INTEGER,
  FOREIGN KEY (usuario_sk) REFERENCES usuario(id_usuario)
);
