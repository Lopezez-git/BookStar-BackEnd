import { Router } from "express";
import { inserirLivro } from "../repository/livroRepository.js";
import multer from "multer";
import path from "path";

let endPoints = Router();

// Upload no diretório /storage/perfil
let uploadPerfil = multer({ dest: path.resolve('storage', 'capa') });

endPoints.post('/livro/post', uploadPerfil.single('capa'), async (req, resp) => {
  try {

    let livro = req.body;

    if (!livro.titulo || !livro.descricao || !livro.autores) {
      return resp.status(400).send({ erro: "Campos obrigatórios ausentes." });
    }

    // Verifica se o arquivo
    //  foi enviado
    if (!req.file) {
      return resp.status(400).send({ erro: "Envie a capa do livro." });
    }

    // Nome do arquivo salvo pelo multer
    livro.capa_url = `/storage/capa/${req.file.filename}`;

    let novoLivro = await inserirLivro(livro);

    resp.status(201).send({
      mensagem: "Livro inserido com sucesso!",
      livro: novoLivro[0]
    });

  } catch (err) {
    console.error(err);
    resp.status(500).send({ erro: "Erro ao inserir livro." });
  }
});

export default endPoints;

