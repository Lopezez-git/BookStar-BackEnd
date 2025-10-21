import { Router } from "express";

import axios from "axios";

import popularLivros from "../repository/livroRepository.js";

let endPoints = Router();

//Populando o banco de dados de livro;

endPoints.post("/popular-livros", async (req, res) => {
  try {
    const { q } = req.body; // termo de busca, ex: { "q": "harry potter" }

    if (!q) {
      return res.status(400).json({ erro: "Informe um termo de busca em 'q'" });
    }

    const response = await axios.get("https://www.googleapis.com/books/v1/volumes", {
      params: { q, maxResults: 10 }
    });

    const livros = response.data.items.map(item => ({
      titulo: item.volumeInfo.title || "Sem título",
      autor: item.volumeInfo.authors ? item.volumeInfo.authors.join(", ") : "Desconhecido",
      descricao: item.volumeInfo.description || "Sem descrição",
      imagem: item.volumeInfo.imageLinks?.thumbnail || ""
    }));

        popularLivros(livros);

    res.json({ mensagem: "Livros salvos com sucesso!", total: livros.length });
  } catch (error) {
    console.error("Erro ao popular livros:", error.message);
    res.status(500).json({ erro: "Erro ao buscar ou salvar livros" });
  }
});


export default endPoints;