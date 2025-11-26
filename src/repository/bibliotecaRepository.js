import connection from './connection.js';

export async function salvarLivrosNaBiblioteca(usuario_id, livro_id, comentario, avaliacao, status) {

    let comando = `
        INSERT INTO biblioteca_usuario
            (id_usuario, id_livro, status, avaliacao, comentario, dataInicio, dataFim)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    // Aqui precisam ser 5 valores depois dos IDs
    let valores = [
        usuario_id,
        livro_id,
        status,
        avaliacao,   // avaliacao
        comentario,   // comentario
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
        `SELECT l.id, l.titulo, l.autores, l.descricao,
         l.capa_url, b.status
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
        "DELETE FROM biblioteca_usuario WHERE id_usuario = ? AND id_livro = ?",
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

export async function listarPorQueroLer(usuario_id) {
    let comando = `
        SELECT 
            bu.id,
            bu.status,
            bu.avaliacao,
            bu.comentario,
            bu.dataInicio,
            bu.dataFim,
            l.id AS livroId,
            l.titulo,
            l.autores,
            l.capa_url,
            l.descricao
        FROM biblioteca_usuario bu
        INNER JOIN livro l ON l.id = bu.id_livro
        WHERE bu.status = 'quero ler'
          AND bu.id_usuario = ?
        ORDER BY bu.id DESC
    `;

    let [resultado] = await connection.query(comando, [usuario_id]);

    return resultado;
}

export async function listarPorEstouLendo(usuario_id) {

    let comando = `SELECT 
            bu.id,
            bu.status,
            bu.avaliacao,
            bu.comentario,
            bu.dataInicio,
            bu.dataFim,
            l.id AS livroId,
            l.titulo,
            l.autores,
            l.capa_url,
            l.descricao
        FROM biblioteca_usuario bu
        INNER JOIN livro l ON l.id = bu.id_livro
        WHERE bu.status = 'estou lendo'
          AND bu.id_usuario = ?
        ORDER BY bu.id DESC
    `;

    let [resultado] = await connection.query(comando, [usuario_id]);

    return resultado;
    
}

export async function listarPorLivrosLidos(usuario_id) {

    let comando = `SELECT 
            bu.id,
            bu.status,
            bu.avaliacao,
            bu.comentario,
            bu.dataInicio,
            bu.dataFim,
            l.id AS livroId,
            l.titulo,
            l.autores,
            l.capa_url,
            l.descricao
        FROM biblioteca_usuario bu
        INNER JOIN livro l ON l.id = bu.id_livro
        WHERE bu.status = 'concluido'
          AND bu.id_usuario = ?
        ORDER BY bu.id DESC
    `;

    let [resultado] = await connection.query(comando, [usuario_id]);

    return resultado;
    
}

export async function atualizarStatus(usuario_id, livro_id, novoStatus) {
    const comando = `
        UPDATE biblioteca_usuario
        SET status = ?
        WHERE id_usuario = ? AND id_livro = ?
    `;

    let [resultado] = await connection.query(comando, [novoStatus, usuario_id, livro_id]);

    return resultado;
}

export async function atualizarLivroBiblioteca(idUsuario, idLivro, dados) {

    const comando = `
        UPDATE biblioteca_usuario
        SET 
            status = ?,
            avaliacao = ?,
            comentario = ?,
            dataInicio = ?,
            dataFim = ?
        WHERE id_usuario = ? AND id_livro = ?
    `;

    let params = [
        dados.status,
        dados.avaliacao,
        dados.comentario,
        dados.dataInicio || null,
        dados.dataFim || null,
        idUsuario,
        idLivro
    ];

    let [result] = await connection.query(comando, params);

    return result.affectedRows > 0;
}

