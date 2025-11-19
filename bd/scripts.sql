-- Criação do schema
CREATE SCHEMA IF NOT EXISTS lista_tarefas;

SET search_path TO lista_tarefas;

-- Tabela de usuários
CREATE TABLE IF NOT EXISTS usuarios (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  senha VARCHAR(255) NOT NULL,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de categorias
CREATE TABLE IF NOT EXISTS categorias (
  id SERIAL PRIMARY KEY,
  usuario_id INT REFERENCES usuarios(id) ON DELETE CASCADE,
  nome VARCHAR(100) NOT NULL,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criando ENUM para status
DO $$
BEGIN
   IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'status_enum') THEN
      CREATE TYPE status_enum AS ENUM ('pendente', 'concluida');
   END IF;
END$$;

-- Tabela de tarefas
CREATE TABLE IF NOT EXISTS tarefas (
  id SERIAL PRIMARY KEY,
  usuario_id INT REFERENCES usuarios(id) ON DELETE CASCADE,
  categoria_id INT REFERENCES categorias(id) ON DELETE SET NULL,
  titulo VARCHAR(200) NOT NULL,
  descricao TEXT,
  data_vencimento DATE,
  hora_vencimento TIME,
  status status_enum DEFAULT 'pendente',
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela para sessões
CREATE TABLE IF NOT EXISTS login_sessoes (
  id SERIAL PRIMARY KEY,
  usuario_id INT REFERENCES usuarios(id) ON DELETE CASCADE,
  token VARCHAR(255) NOT NULL,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expira_em TIMESTAMP NOT NULL
);

-- Inserção de usuário de exemplo
INSERT INTO usuarios (nome, email, senha)
VALUES ('Bruno Teste', 'bruno.teste@gmail.com',
        '$2y$10$AyGo2dF2wPQ3E9AiobtrUOBrs1F/RF7gRarHRpQ4bUgMXY0pv8k5S');

-- Inserção de categorias de exemplo
INSERT INTO categorias (usuario_id, nome)
VALUES
  (1, 'Trabalho'),
  (1, 'Pessoal'),
  (1, 'Compras');

-- Inserção de tarefas de exemplo
INSERT INTO tarefas (usuario_id, categoria_id, titulo, descricao, data_vencimento, hora_vencimento)
VALUES
  (1, 1, 'Reunião de projeto', 'Reunião da semana referente ao projeto de semestre.', '2025-08-26', '10:00:00'),
  (1, 2, 'Ler livros', 'Editora Dark Side.', '2025-08-27', '18:30:00'),
  (1, 3, 'Comprar novos Livros', 'Editora Dark Side.', '2025-08-29', '17:20:00');