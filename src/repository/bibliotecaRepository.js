import connection from './connection.js';

import autenticar from '../middlewares/autenticar.js';

/**
 * Adiciona um livro à biblioteca do usuário
 * @param {number} idUsuario - ID do usuário
 * @param {object} livro - Dados do livro do Google Books
 * @param {string} status - Status de leitura (padrão: 'quero_ler')
 * @returns {Promise} - Livro adicionado
 */
export async function adicionarLivroBiblioteca(idUsuario, livro, status = 'quero_ler') {
    // Primeiro, verifica se o livro já existe na tabela de livros
    let [livrosExistentes] = await connection.query(
        'SELECT id FROM livro WHERE google_book_id = ?',
        [livro.id]
    );

    let idLivro;

    if (livrosExistentes.length > 0) {
        // Livro já existe
        idLivro = livrosExistentes[0].id;
    } else {
        // Insere novo livro
        const [resultado] = await connection.query(
            `INSERT INTO livro (google_book_id, titulo, autores, descricao, capa_url, 
                                 dataPublic, editora, paginas, isbn)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                livro.id,
                livro.titulo,
                JSON.stringify(livro.autores),
                livro.descricao,
                livro.capa,
                livro.anoPublicacao,
                livro.editora,
                livro.paginas,
                livro.isbn
            ]
        );
        idLivro = resultado.insertId;
    }

    // Verifica se o livro já está na biblioteca do usuário
    let [jaExiste] = await connection.query(
        'SELECT id FROM biblioteca_usuario WHERE id_usuario = ? AND id_livro = ?',
        [idUsuario, idLivro]
    );

    if (jaExiste.length > 0) {
        throw new Error('Livro já está na sua biblioteca');
    }

    // Adiciona à biblioteca do usuário
    const [resultado] = await connection.query(
        `INSERT INTO biblioteca_usuario (id_usuario, id_livro, status, dataInicio, dataCriacao)
         VALUES (?, ?, ?, NOW(), NOW())`,
        [idUsuario, idLivro, status]
    );

    return {
        id_biblioteca: resultado.insertId,
        id_livro: idLivro,
        status: status,
        ...livro
    };
}

/**
 * Lista todos os livros da biblioteca de um usuário
 * @param {number} idUsuario - ID do usuário
 * @param {string} status - Filtrar por status (opcional)
 * @returns {Promise} - Lista de livros
 */
export async function listarBibliotecaUsuario(idUsuario, status = null) {
    let query = `
        SELECT 
            b.id,
            b.status,
            b.avaliacao,
            b.comentario,
            b.dataInicio,
            b.dataFim,
            b.dataCriacao,
            l.*
        FROM biblioteca_usuario b
        JOIN livro l ON b.id_livro = l.id
        WHERE b.id_usuario = ?
    `;

    const params = [idUsuario];

    if (status) {
        query += ' AND b.status = ?';
        params.push(status);
    }

    query += ' ORDER BY b.dataCriacao DESC';

    const [livros] = await connection.query(query, params);

    // Parsear JSON dos autores
    return livros.map(livro => ({
        ...livro,
        autores: JSON.parse(livro.autores)
    }));
}

/**
 * Atualiza o status de leitura de um livro
 * @param {number} idUsuario - ID do usuário
 * @param {number} idLivro - ID do livro
 * @param {string} novoStatus - Novo status
 * @returns {Promise} - Resultado da atualização
 */
export async function atualizarStatusLivro(idUsuario, idLivro, novoStatus) {
    const camposAtualizar = ['status = ?'];
    const valores = [novoStatus];

    // Se mudou para "lendo", atualiza dataInicio
    if (novoStatus === 'lendo') {
        camposAtualizar.push('dataInicio = NOW()');
    }

    // Se mudou para "lido", atualiza dataFim
    if (novoStatus === 'lido') {
        camposAtualizar.push('dataFim = NOW()');
    }

    valores.push(idUsuario, idLivro);

    const [resultado] = await connection.query(
        `UPDATE biblioteca_usuario 
         SET ${camposAtualizar.join(', ')}
         WHERE id_usuario = ? AND id_livro = ?`,
        valores
    );

    return resultado.affectedRows > 0;
}

/**
 * Adiciona/atualiza avaliação e comentário de um livro
 * @param {number} idUsuario - ID do usuário
 * @param {number} idLivro - ID do livro
 * @param {number} avaliacao - Nota (1-5)
 * @param {string} comentario - Comentário sobre o livro
 * @returns {Promise} - Resultado da atualização
 */
export async function avaliarLivro(idUsuario, idLivro, avaliacao, comentario) {
    const [resultado] = await connection.query(
        `UPDATE biblioteca_usuario 
         SET avaliacao = ?, comentario = ?
         WHERE id_usuario = ? AND id_livro = ?`,
        [avaliacao, comentario, idUsuario, idLivro]
    );

    return resultado.affectedRows > 0;
}

/**
 * Remove um livro da biblioteca
 * @param {number} idUsuario - ID do usuário
 * @param {number} idLivro - ID do livro
 * @returns {Promise} - Resultado da remoção
 */
export async function removerLivroBiblioteca(idUsuario, idLivro) {
    const [resultado] = await connection.query(
        'DELETE FROM biblioteca_usuario WHERE id_usuario = ? AND id_livro = ?',
        [idUsuario, idLivro]
    );

    return resultado.affectedRows > 0;
}

/**
 * Obtém estatísticas da biblioteca do usuário
 * @param {number} idUsuario - ID do usuário
 * @returns {Promise} - Estatísticas
 */
export async function obterEstatisticasBiblioteca(idUsuario) {
    const [stats] = await connection.query(
        `SELECT 
            COUNT(*) as total_livros,
            SUM(CASE WHEN status = 'quero_ler' THEN 1 ELSE 0 END) as quero_ler,
            SUM(CASE WHEN status = 'lendo' THEN 1 ELSE 0 END) as lendo,
            SUM(CASE WHEN status = 'lido' THEN 1 ELSE 0 END) as lidos,
            AVG(avaliacao) as media_avaliacoes,
            SUM(l.paginas) as total_paginas_lidas
         FROM biblioteca_usuario b
         JOIN livros l ON b.id_livro = l.id
         WHERE b.id_usuario = ? AND b.status = 'lido'`,
        [idUsuario]
    );

    return stats[0];
}