import { Router } from "express";
import { buscarLivros, buscarLivroPorId, buscarLivroPorISBN } from "../services/googleBooksService.js";
import {
    adicionarLivroBiblioteca,
    listarBibliotecaUsuario,
    atualizarStatusLivro,
    removerLivroBiblioteca,
    avaliarLivro
} from "../repository/bibliotecaRepository.js";

import autenticar from "../middlewares/autenticar.js";

let endPoints = Router();

endPoints.get('/livros/buscar', autenticar, async (req, resp) => {
    try {
        const { titulo, maxResults } = req.query;

        if (!titulo) {
            return resp.status(400).send({
                erro: 'Título do livro é obrigatório'
            });
        }

        const livros = await buscarLivros(titulo, maxResults || 10);

        if (!livros) {
            return resp.status(404).send({
                erro: 'Nenhum livro encontrado com esse título'
            });
        }

        resp.send({
            total: livros.length,
            livros: livros
        });

    } catch (error) {
        console.error('Erro ao buscar livros:', error);
        resp.status(500).send({
            erro: 'Erro ao buscar livros na API'
        });
    }
});

endPoints.post('/usuario/biblioteca/post', autenticar, async (req, resp) => {
    try {
        const idUsuario = req.usuario.id;
        const { titulo, googleBooksId } = req.body;

        // Opção 1: Se recebeu o ID do Google Books
        if (googleBooksId) {
            const livro = await buscarLivroPorId(googleBooksId);

            if (!livro) {
                return resp.status(404).send({
                    erro: 'Livro não encontrado na Google Books'
                });
            }

            // Salvar na biblioteca do usuário
            const resultado = await adicionarLivroBiblioteca(idUsuario, livro);

            return resp.status(201).send({
                mensagem: 'Livro adicionado à biblioteca',
                livro: resultado
            });
        }

        // Opção 2: Se recebeu apenas o título, busca e retorna opções
        if (titulo) {
            const livros = await buscarLivros(titulo, 5);

            if (!livros) {
                return resp.status(404).send({
                    erro: 'Nenhum livro encontrado com esse título'
                });
            }

            // Retorna opções para o usuário escolher
            return resp.send({
                mensagem: 'Selecione o livro correto',
                opcoes: livros
            });
        }

        return resp.status(400).send({
            erro: 'Envie googleBooksId ou titulo'
        });

    } catch (error) {
        console.error('Erro ao adicionar livro:', error);
        resp.status(500).send({
            erro: 'Erro ao adicionar livro à biblioteca'
        });
    }
});

endPoints.get('/usuario/biblioteca', autenticar, async (req, resp) => {
    try {
        const idUsuario = req.usuario.id;

        const biblioteca = await listarBibliotecaUsuario(idUsuario);

        resp.send({
            total: biblioteca.length,
            livros: biblioteca
        });

    } catch (error) {
        console.error('Erro ao listar biblioteca:', error);
        resp.status(500).send({
            erro: 'Erro ao listar biblioteca'
        });
    }
});

/**
 * Atualiza status de leitura de um livro
 */
endPoints.put('/usuario/biblioteca/:idLivro/status', autenticar, async (req, resp) => {
    try {
        const idUsuario = req.usuario.id;
        const idLivro = parseInt(req.params.idLivro);
        const { status } = req.body;

        const statusValidos = ['quero_ler', 'lendo', 'lido'];

        if (!status || !statusValidos.includes(status)) {
            return resp.status(400).send({
                erro: 'Status inválido. Use: quero_ler, lendo ou lido'
            });
        }

        const atualizado = await atualizarStatusLivro(idUsuario, idLivro, status);

        if (!atualizado) {
            return resp.status(404).send({
                erro: 'Livro não encontrado na biblioteca'
            });
        }

        resp.send({
            mensagem: 'Status atualizado com sucesso',
            status: status
        });

    } catch (error) {
        console.error('Erro ao atualizar status:', error);
        resp.status(500).send({
            erro: 'Erro ao atualizar status'
        });
    }
});

/**
 * Remove livro da biblioteca
 */
endPoints.delete('/usuario/biblioteca/:idLivro', autenticar, async (req, resp) => {
    try {
        const idUsuario = req.usuario.id;
        const idLivro = parseInt(req.params.idLivro);

        const removido = await removerLivroBiblioteca(idUsuario, idLivro);

        if (!removido) {
            return resp.status(404).send({
                erro: 'Livro não encontrado na biblioteca'
            });
        }

        resp.send({
            mensagem: 'Livro removido da biblioteca'
        });

    } catch (error) {
        console.error('Erro ao remover livro:', error);
        resp.status(500).send({
            erro: 'Erro ao remover livro'
        });
    }
});

/**
 * Avalia os livros da biblioteca
 */

endPoints.put('/usuario/biblioteca/:idLivro/avaliar', autenticar, async (req, resp) => {
    try {
        const idUsuario = req.usuario.id;
        const idLivro = parseInt(req.params.idLivro);
        const { avaliacao, comentario } = req.body;

        if (!avaliacao || avaliacao < 1 || avaliacao > 5) {
            return resp.status(400).send({
                erro: 'Avaliação deve ser entre 1 e 5'
            });
        }

        const atualizado = await avaliarLivro(idUsuario, idLivro, avaliacao, comentario || '');

        if (!atualizado) {
            return resp.status(404).send({
                erro: 'Livro não encontrado na biblioteca'
            });
        }

        resp.send({
            mensagem: 'Avaliação salva com sucesso',
            avaliacao,
            comentario
        });

    } catch (error) {
        console.error('Erro ao avaliar livro:', error);
        resp.status(500).send({
            erro: 'Erro ao avaliar livro'
        });
    }
});

/**
 * Obtém estatísticas da biblioteca
 */
endPoints.get('/usuario/biblioteca/estatisticas', autenticar, async (req, resp) => {
    try {
        const idUsuario = req.usuario.id;

        const stats = await obterEstatisticasBiblioteca(idUsuario);

        resp.send(stats);

    } catch (error) {
        console.error('Erro ao obter estatísticas:', error);
        resp.status(500).send({
            erro: 'Erro ao obter estatísticas'
        });
    }
});


export default endPoints;