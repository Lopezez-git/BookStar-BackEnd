-- ============================================
-- SCRIPT DE MIGRAÇÃO - BOOKSTART
-- ============================================
-- INSTRUÇÕES:
-- 1. Faça git clone do repositório
-- 2. Crie o banco: CREATE DATABASE bookstart;
-- 3. USE bookstart;
-- 4. Execute este script: source caminho/para/este/arquivo.sql
-- ============================================

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS biblioteca;
DROP TABLE IF EXISTS seguidores;
DROP TABLE IF EXISTS usuario;
DROP TABLE IF EXISTS livro;
SET FOREIGN_KEY_CHECKS = 1;

-- ============================================
-- TABELA: usuario
-- ============================================
CREATE TABLE usuario (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  username VARCHAR(100) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  cpf VARCHAR(11) not NULL,
  senha_hash VARCHAR(255) NOT NULL,
  imagem_perfil VARCHAR(255) DEFAULT NULL,
  data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABELA: livro
-- ============================================
CREATE TABLE livro (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(255) NOT NULL,
  descricao TEXT,
  autores VARCHAR(255),
  capa_url VARCHAR(500),
  data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABELA: biblioteca (livros do usuário)
-- ============================================
CREATE TABLE biblioteca (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_usuario INT NOT NULL,
  id_livro INT NOT NULL,
  avaliacao INT DEFAULT 0 CHECK (avaliacao BETWEEN 0 AND 5),
  comentario TEXT,
  status ENUM('quero ler', 'estou lendo', 'concluido') DEFAULT 'quero ler',
  data_adicao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_usuario) REFERENCES usuario(id) ON DELETE CASCADE,
  FOREIGN KEY (id_livro) REFERENCES livro(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_book (id_usuario, id_livro)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABELA: seguidores
-- ============================================
CREATE TABLE seguidores (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_seguidor INT NOT NULL,
  id_seguido INT NOT NULL,
  data_seguiu TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_seguidor) REFERENCES usuario(id) ON DELETE CASCADE,
  FOREIGN KEY (id_seguido) REFERENCES usuario(id) ON DELETE CASCADE,
  UNIQUE KEY unique_follow (id_seguidor, id_seguido),
  CHECK (id_seguidor != id_seguido)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;



INSERT INTO livro (titulo, descricao, autores, capa_url) VALUES
('A Biblioteca Da Meia Noite', 'Nora Seed se sente perdida e cheia de arrependimentos. Em um momento de desespero, ela se vê em uma biblioteca misteriosa entre a vida e a morte, onde cada livro representa uma vida que ela poderia ter vivido.', 'Matt Haig', '/storage/capa/f5aeb25865254900e7998f8f0c89cb0c'),
('Vermelho, Branco e Sangue Azul', 'Alex Claremont-Diaz, filho da primeira presidenta dos Estados Unidos, precisa manter as aparências em público, especialmente com o príncipe Henry da Inglaterra, com quem finge uma amizade para a mídia. Mas quando a farsa se transforma em algo real e inesperado, Alex descobre que seus sentimentos pelo príncipe vão muito além da diplomacia.', 'Casey McQuiston', '/storage/capa/cbe8a9679aa6f98cd4bb7f980c36ae12'),
('Nem Todo Amor Tem Um Final Feliz. E Tá Tudo Bem', 'Uma coletânea sensível de poemas e reflexões sobre amores que não deram certo, despedidas necessárias e a beleza de seguir em frente. Este livro celebra a cura emocional e a aceitação de que nem todos os relacionamentos precisam durar para sempre para serem significativos.', 'Diversos Autores', '/storage/capa/75bb5c4d4d68c10b0fe4bc84768cf399'),
('A Good Girl''s Guide to Murder', 'Pippa Fitz-Amobi escolhe investigar um caso de assassinato já resolvido como projeto de conclusão de curso. Cinco anos atrás, a estudante Andie Bell foi morta, e seu namorado Sal Singh foi considerado culpado antes de cometer suicídio.', 'Holly Jackson', '/storage/capa/33a64039e45ec7d61eb78dbe0dca5429'),
('Bitten', 'Elena Michaels é a única lobisomem mulher do mundo, e ela odeia isso. Tentando viver uma vida normal em Toronto, ela é forçada a retornar à alcateia quando lobisomens rebeldes começam a ameaçar sua família sobrenatural.', 'Kelley Armstrong', '/storage/capa/58bf2d89a2d06c65f32afab47a351d86'),
('Manual de Assassinato para Boas Garotas', 'Pippa Fitz-Amobi está de volta em uma nova investigação. Desta vez, ela cria um podcast sobre crimes e recebe um pedido angustiante: encontrar Jamie Reynolds, que desapareceu misteriosamente. Conforme Pip mergulha no caso.', 'Holly Jackson', '/storage/capa/98dabbd7e163bdfe4be10bd5528877a0'),
('O Silêncio dos Inocentes', 'Clarice Starling, uma jovem agente do FBI em treinamento, é designada para entrevistar o brilhante psiquiatra e serial killer Hannibal Lecter, preso em um hospital psiquiátrico de segurança máxima.', 'Thomas Harris', '/storage/capa/ebc35455b816f5b7e79a5bb2385be483'),
('Amor Pelas Coisas Imperfeitas', 'Uma reflexão poética sobre a aceitação das imperfeições da vida e das pessoas ao nosso redor. Através de textos curtos e profundos, o livro convida o leitor a abraçar suas falhas.', 'Haemin Sunim', '/storage/capa/47aff7fa9f53eb41f0ac9d5a17eb925e'),
('Para Todas as Pessoas Resilientes', 'Uma coletânea de textos inspiradores dedicados àqueles que enfrentam adversidades com coragem e determinação. O livro celebra a força interior, a capacidade de recomeçar e o poder da resiliência emocional.', 'Diversos Autores', '/storage/capa/bc891dff179f8bc9dea611b13fb20542'),
('1984', 'Em um futuro distópico totalitário, Winston Smith vive sob a vigilância constante do Grande Irmão, o líder supremo do Partido que controla todos os aspectos da vida.', 'George Orwell', '/storage/capa/7ea74e0abfdf31a7551ca1b4b9c11a43'),
('As Coisas Que Você Só Vê Quando Desacelera', 'Em um futuro distópico totalitário, Winston Smith vive sob a vigilância constante do Grande Irmão, o líder supremo do Partido que controla todos os aspectos da vida.', 'George Orwell', '/storage/capa/76420bcc98e65df81b0716b0b81ca8c4'),
('Assombrando Adeline', 'Em um futuro distópico totalitário, Winston Smith vive sob a vigilância constante do Grande Irmão, o líder supremo do Partido que controla todos os aspectos da vida.', 'George Orwell', '/storage/capa/32b8884ff250b7225701b61aa736f1ac'),
('Assistente do Vilão', 'Em um futuro distópico totalitário, Winston Smith vive sob a vigilância constante do Grande Irmão, o líder supremo do Partido que controla todos os aspectos da vida.', 'George Orwell', '/storage/capa/84d391569939442538c6438662695678'),
('Textos Cruéis Demais Para Serem Lidos Rapidamente: Onde Dorme o Amor', 'Em um futuro distópico totalitário, Winston Smith vive sob a vigilância constante do Grande Irmão, o líder supremo do Partido que controla todos os aspectos da vida.', 'George Orwell', '/storage/capa/6e2f4c47059a8d2f311259c037f7fd38'),
('Carmilla', 'Em um futuro distópico totalitário, Winston Smith vive sob a vigilância constante do Grande Irmão, o líder supremo do Partido que controla todos os aspectos da vida.', 'George Orwell', '/storage/capa/8b02a21dc5d1bff1465821f965547686'),
('Dias Perfeitos', 'Em um futuro distópico totalitário, Winston Smith vive sob a vigilância constante do Grande Irmão, o líder supremo do Partido que controla todos os aspectos da vida.', 'George Orwell', '/storage/capa/d3a0df5aa79865ddb89015d82e8eb59b'),
('Ninguém Vai Te Ouvir Gritar', 'Em um futuro distópico totalitário, Winston Smith vive sob a vigilância constante do Grande Irmão, o líder supremo do Partido que controla todos os aspectos da vida.', 'George Orwell', '/storage/capa/5cfc6577fd5829f11dd6882a3fb940e1'),
('O Que o Sol Faz Com as Flores', 'Em um futuro distópico totalitário, Winston Smith vive sob a vigilância constante do Grande Irmão, o líder supremo do Partido que controla todos os aspectos da vida.', 'George Orwell', '/storage/capa/7203b5da0f5889860e7e24428b7ffb35'),
('Dragão Vermelho', 'Em um futuro distópico totalitário, Winston Smith vive sob a vigilância constante do Grande Irmão, o líder supremo do Partido que controla todos os aspectos da vida.', 'George Orwell', '/storage/capa/c684da14df1685c4cae874a16389cc08'),
('Todas as Dores de Que Me Libertei e Sobrevivi', 'Em um futuro distópico totalitário, Winston Smith vive sob a vigilância constante do Grande Irmão, o líder supremo do Partido que controla todos os aspectos da vida.', 'George Orwell', '/storage/capa/4cbdfb0ccb219b066f25ee7370ef710a'),
('Tudo Que Meu Coração Grita', 'Em um futuro distópico totalitário, Winston Smith vive sob a vigilância constante do Grande Irmão, o líder supremo do Partido que controla todos os aspectos da vida.', 'George Orwell', '/storage/capa/2334f3395015fea9a7b45e06704f2633'),
('Harry Potter e as Relíquias da Morte', 'Em um futuro distópico totalitário, Winston Smith vive sob a vigilância constante do Grande Irmão, o líder supremo do Partido que controla todos os aspectos da vida.', 'George Orwell', '/storage/capa/dd3cba5998463788c33b67fcde7e395c'),
('It: A Coisa', 'Em um futuro distópico totalitário, Winston Smith vive sob a vigilância constante do Grande Irmão, o líder supremo do Partido que controla todos os aspectos da vida.', 'George Orwell', '/storage/capa/e5297047080d514a8b0608dad02dedbc'),
('Fim de Jogo', 'Em um futuro distópico totalitário, Winston Smith vive sob a vigilância constante do Grande Irmão, o líder supremo do Partido que controla todos os aspectos da vida.', 'George Orwell', '/storage/capa/44be77ec43e0ae8f7cb414c8c0c5ec4d'),
('O Visitante', 'Em um futuro distópico totalitário, Winston Smith vive sob a vigilância constante do Grande Irmão, o líder supremo do Partido que controla todos os aspectos da vida.', 'George Orwell', '/storage/capa/c508de65b068c1a085960dcfa95141f2'),
('Textos Cruéis Demais Para Serem Lidos Rapidamente', 'Em um futuro distópico totalitário, Winston Smith vive sob a vigilância constante do Grande Irmão, o líder supremo do Partido que controla todos os aspectos da vida.', 'George Orwell', '/storage/capa/c7f824d16e11d48b8b62d8b9ab2fc265'),
('You: Você', 'Em um futuro distópico totalitário, Winston Smith vive sob a vigilância constante do Grande Irmão, o líder supremo do Partido que controla todos os aspectos da vida.', 'George Orwell', '/storage/capa/75ba97fc0892638e4e234cdb98e9a27c'),
('Os Dois Morrem no Final', 'Em um futuro próximo, uma empresa chamada Morte-Casting liga para pessoas nas primeiras horas da manhã para avisá-las que morrerão naquele dia.', 'Adam Silvera', '/storage/capa/7585960e07a8159666b8a573ce530a3d'),
('Um Por Um', 'Em um futuro próximo, uma empresa chamada Morte-Casting liga para pessoas nas primeiras horas da manhã para avisá-las que morrerão naquele dia.', 'Adam Silvera', '/storage/capa/01b9c9646602193f4e2b8d23c6bafc76'),
('A Contadora de Histórias', 'Em um futuro próximo, uma empresa chamada Morte-Casting liga para pessoas nas primeiras horas da manhã para avisá-las que morrerão naquele dia.', 'Adam Silvera', '/storage/capa/668655e46c9a691d83079ed9c0f016e4'),
('O Menino que Desenhava Monstros', 'Em um futuro próximo, uma empresa chamada Morte-Casting liga para pessoas nas primeiras horas da manhã para avisá-las que morrerão naquele dia.', 'Adam Silvera', '/storage/capa/fde3413606107787eee7c6cf020e44c7'),
('O Massacre da Família Hope', 'Em um futuro próximo, uma empresa chamada Morte-Casting liga para pessoas nas primeiras horas da manhã para avisá-las que morrerão naquele dia.', 'Adam Silvera', '/storage/capa/80dbcd8a28f812b4ca569a0666101cde'),
('Pedra Papel Tesoura', 'Em um futuro próximo, uma empresa chamada Morte-Casting liga para pessoas nas primeiras horas da manhã para avisá-las que morrerão naquele dia.', 'Adam Silvera', '/storage/capa/eedeb73f832dfedfd1791ef934c9a218'),
('Mindhunter: O Primeiro Caçador de Serial Killers Americano', 'Em um futuro próximo, uma empresa chamada Morte-Casting liga para pessoas nas primeiras horas da manhã para avisá-las que morrerão naquele dia.', 'Adam Silvera', '/storage/capa/87cbe3b38cc934f2c6d594025f2473cf'),
('Filho Perfeito', 'Em um futuro próximo, uma empresa chamada Morte-Casting liga para pessoas nas primeiras horas da manhã para avisá-las que morrerão naquele dia.', 'Adam Silvera', '/storage/capa/b5273b1caec3d2eb4b2aa96a3167d04a'),
('Quem É Você, Alasca?', 'Em um futuro próximo, uma empresa chamada Morte-Casting liga para pessoas nas primeiras horas da manhã para avisá-las que morrerão naquele dia.', 'Adam Silvera', '/storage/capa/d7547cfe56ffcfeb89236fe0c0859b00');


CREATE INDEX idx_biblioteca_usuario ON biblioteca(id_usuario);
CREATE INDEX idx_biblioteca_livro ON biblioteca(id_livro);
CREATE INDEX idx_biblioteca_status ON biblioteca(status);
CREATE INDEX idx_seguidores_seguidor ON seguidores(id_seguidor);
CREATE INDEX idx_seguidores_seguido ON seguidores(id_seguido);
CREATE INDEX idx_livro_titulo ON livro(titulo);

-- ============================================
-- VERIFICAÇÃO FINAL
-- ============================================
SELECT '✓ Script executado com sucesso!' AS status;
SELECT 'Usuários criados:' AS info, COUNT(*) AS total FROM usuario;
SELECT 'Livros cadastrados:' AS info, COUNT(*) AS total FROM livro;
SELECT 'Relacionamentos:' AS info, COUNT(*) AS total FROM seguidores;
SELECT 'Livros na biblioteca:' AS info, COUNT(*) AS total FROM biblioteca;

-- ============================================
-- PRÓXIMOS PASSOS
-- ============================================
-- 1. Configure o .env no backend
-- 2. Execute: npm install
-- 3. Execute: npm start
-- 4. Acesse: http://localhost:5010

SELECT * FROM usuario;