
import connection from "./connection.js";

export default async function popularLivros(livros) {

    for (const livro of livros) {
      await connection.query(
        `INSERT INTO livro
        (titulo, google_book_id, descricao, capa_url, dataPublic, paginas, idioma) 
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          livro.titulo,
          livro.google_book_id,
          livro.descricao,
          livro.capa_url,
          livro.dataPublic,
          livro.paginas,
          livro.idioma
        ]
      );
    }

    return true;
    

}