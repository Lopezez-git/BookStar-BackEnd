
import connection from "./connection.js";

export async function inserirLivro(livro) {

  let [insert] = await connection.query(`insert into livro(titulo, descricao, autores, capa_url)
    values(?, ?, ?, ?)`, [livro.titulo, livro.descricao, livro.autores, livro.capa_url]);

  let [select] = await connection.query(`SELECT * FROM livro WHERE id = ?`, [insert.insertId]);

  return select;
  
}

export async function buscarLivroPorTitulo(titulo_livro) {

    let comando = `SELECT * FROM livro WHERE titulo = ?`;

    let [select] = await connection.query(comando, [titulo_livro]);

    return select;
}

