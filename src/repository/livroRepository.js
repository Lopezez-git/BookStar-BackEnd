
import connection from "./connection.js";

export async function buscarLivroPorTitulo(titulo_livro) {

    let comando = `SELECT * FROM livro WHERE titulo = ?`;

    let [select] = await connection.query(comando, [titulo_livro]);

    return select;

}

