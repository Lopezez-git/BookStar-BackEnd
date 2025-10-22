import { Router } from "express";
import axios from "axios";
import popularLivros from "../repository/livroRepository.js";
import { formatarData } from "../services/services.js";

let endPoints = Router();

//endPoint para popular o bando de dados dos livros

endPoints.post("/popular-livros", async (req, res) => {
  try {
    const { q } = req.body;

    if (!q) {
      return res.status(400).json({ erro: "Informe um termo de busca em 'q'" });
    }

    // pegando a URL da Api do google
    const response = await axios.get("https://www.googleapis.com/books/v1/volumes", {
      params: { q, maxResults: 10}// <== Quantidade maxima de inserts no banco
    });

    if (!response.data.items) {
      return res.json({ mensagem: "Nenhum livro encontrado" });
    }

    //Criando um objeto "livros" que no final retorna os atributos do livro 
    const livros = response.data.items.map(item => {

      let capaUrl = item.volumeInfo.imageLinks?.thumbnail || 
                    item.volumeInfo.imageLinks?.smallThumbnail || 
                    null; // pega as capas dos livros em tamanhos diferentes
      
      if (capaUrl) {
        capaUrl = capaUrl.replace('http://', 'https://');
      }

      return {
        titulo: item.volumeInfo.title || "Sem título",
        google_book_id: item.id || null,
        descricao: item.volumeInfo.description || "Sem descrição",
        capa_url: capaUrl,
        dataPublic: formatarData(item.volumeInfo.publishedDate) || null,
        paginas: item.volumeInfo.pageCount || null,
        idioma: item.volumeInfo.language || null
      };
    });

    //inseri o obj no banco
    await popularLivros(livros);

    res.json({ 
      mensagem: "Livros salvos com sucesso!", 
      total: livros.length 
    });

  } catch (error) {
    console.error("Erro ao popular livros:", error.message);
    res.status(500).json({ erro: "Erro ao buscar ou salvar livros" });
  }
});

export default endPoints;