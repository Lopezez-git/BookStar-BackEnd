import connection from "./connection.js";

export async function comentar(usuario, livro, texto) {
    try {
        // Verifica se o livro existe
        let comando = `SELECT * FROM livro WHERE titulo = ?`;
        let [livroExiste] = await connection.query(comando, [livro]);

        if (livroExiste.length === 0) {
            return { erro: "Livro não existe no banco de dados" };
        }

        // Insere o comentário
        comando = `INSERT INTO comentario(id_usuario, id_livro, texto, dataCriacao) VALUES (?, ?, ?, NOW())`;
        let [info] = await connection.query(comando, [usuario, livroExiste[0].id, texto]);

        // Retorna o ID do comentário inserido
        return { id_comentario: info.insertId };
    } catch (err) {
        console.error("Erro no repositório:", err);
        return { erro: "Erro ao comentar" };
    }
}
