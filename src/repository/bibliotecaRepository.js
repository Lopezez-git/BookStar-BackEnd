import connection from './connection.js';

export async function salvarLivrosNaBiblioteca(usuario_id, livro_id) {

    let comando = `
        INSERT INTO biblioteca_usuario
            (id_usuario, id_livro, status, avaliacao, comentario, dataInicio, dataFim)
        VALUES (?, ?, 'quero ler', ?, ?, ?, ?)
    `;

    // Aqui precisam ser 5 valores depois dos IDs
    let valores = [
        usuario_id,
        livro_id,
        null,   // avaliacao
        null,   // comentario
        null,   // dataInicio
        null    // dataFim
    ];

    let [inserir] = await connection.query(comando, valores);

    // Buscar registro recém inserido
    let [select] = await connection.query(
        `SELECT * FROM biblioteca_usuario WHERE id = ?`,
        [inserir.insertId]
    );

    return select;
}

export async function listarBibliotecaUsuario(usuarioId) {
    const [resp] = await connection.query(
        `SELECT l.id, l.titulo, l.autores, l.descricao, l.capa_url
         FROM biblioteca_usuario b
         INNER JOIN livro l ON b.id_livro = l.id
         WHERE b.id_usuario = ?`,
        [usuarioId]
    );
    return resp;
}

// Remover livro
export async function removerLivroDaBiblioteca(usuarioId, livroId) {
    const [resp] = await connection.query(
        "DELETE FROM biblioteca WHERE id_usuario = ? AND id_livro = ?",
        [usuarioId, livroId]
    );
    return resp;
}

// Verificar duplicação
export async function verificarLivroNaBiblioteca(usuarioId, livroId) {
    const [resp] = await connection.query(
        "SELECT * FROM biblioteca_usuario WHERE id_usuario = ? AND id_livro = ?",
        [usuarioId, livroId]
    );
    return resp;
}
