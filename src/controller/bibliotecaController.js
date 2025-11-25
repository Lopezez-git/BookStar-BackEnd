import { Router } from "express";
import autenticar from "../middlewares/autenticar.js";
import { 
    buscarLivroPorTitulo
} from "../repository/livroRepository.js";
import { 
    salvarLivrosNaBiblioteca, 
    listarBibliotecaUsuario,
    removerLivroDaBiblioteca,
    verificarLivroNaBiblioteca,
    listarPorQueroLer,
    atualizarStatus,
    listarPorLivrosLidos,
    listarPorEstouLendo
} from "../repository/bibliotecaRepository.js";

let endPoints = Router();


// Adicionar livro à biblioteca

endPoints.post('/usuario/biblioteca/post/:titulo', autenticar, async (req, resp) => {
    try {
        const tituloLivro = req.params.titulo.trim();
        const usuarioId = req.usuario.id;
        const comentario = req.body.comentario;
        const avaliacao = req.body.avaliacao;

        if (!tituloLivro) {
            return resp.status(400).send({ erro: 'Título do livro não foi informado.' });
        }

        const livro = await buscarLivroPorTitulo(tituloLivro);

        if (!livro || livro.length === 0) {
            return resp.status(404).send({ erro: 'Livro não encontrado.' });
        }

        const livroId = livro[0].id;

        // Verifica se já está salvo
        const jaTem = await verificarLivroNaBiblioteca(usuarioId, livroId);

        if (jaTem.length > 0) {
            return resp.status(409).send({ erro: 'Livro já está na biblioteca do usuário.' });
        }

        const inserido = await salvarLivrosNaBiblioteca(usuarioId, livroId, comentario, avaliacao);

        return resp.status(201).send({
            mensagem: 'Livro adicionado à biblioteca com sucesso!',
            usuario: usuarioId,
            livro: livroId,
            resultado: inserido
        });

    } catch (err) {
        console.error('Erro no POST biblioteca:', err);
        return resp.status(500).send({
            erro: 'Erro interno ao adicionar livro à biblioteca.'
        });
    }
});


//  Listar biblioteca do usuário
endPoints.get('/usuario/biblioteca', autenticar, async (req, resp) => {
    try {
        const usuarioId = req.usuario.id;

        const lista = await listarBibliotecaUsuario(usuarioId);

        return resp.send(lista);

    } catch (err) {
        console.error('Erro no GET biblioteca:', err);
        return resp.status(500).send({
            erro: 'Erro ao buscar biblioteca do usuário.'
        });
    }
});


// Remover livro da biblioteca
endPoints.delete('/usuario/biblioteca/delete/:idLivro', autenticar, async (req, resp) => {
    try {
        const usuarioId = req.usuario.id;
        const idLivro = req.params.idLivro;

        const existe = await verificarLivroNaBiblioteca(usuarioId, idLivro);

        if (existe.length === 0) {
            return resp.status(404).send({ erro: "Esse livro não está na biblioteca." });
        }

        const deletado = await removerLivroDaBiblioteca(usuarioId, idLivro);

        return resp.send({
            mensagem: "Livro removido da biblioteca com sucesso.",
            deletado
        });

    } catch (err) {
        console.error('Erro no DELETE biblioteca:', err);
        return resp.status(500).send({
            erro: 'Erro ao remover livro da biblioteca.'
        });
    }
});

//select com base nos status

endPoints.get('/usuario/biblioteca/quero-ler', autenticar, async (req, resp) => {
    try {
        const usuarioId = req.usuario.id;

        // Chama o repository
        const livros = await listarPorQueroLer(usuarioId);

        console.log(livros)

        if (!livros || livros.length === 0) {
            return resp.status(200).send({
                mensagem: "Nenhum livro marcado como 'quero ler'.",
                livros: []
            });
        }

        return resp.status(200).send({
            quantidade: livros.length,
            livros: livros
        });

    } catch (err) {
        console.error("Erro no GET /usuario/biblioteca/quero-ler:", err);

        return resp.status(500).send({
            erro: "Erro interno ao buscar os livros da biblioteca."
        });
    }
});

// Listar livros com status "estou lendo"
endPoints.get('/usuario/biblioteca/estou-lendo', autenticar, async (req, resp) => {
    try {
        const usuarioId = req.usuario.id;

        const livros = await listarPorEstouLendo(usuarioId);

        if (!livros || livros.length === 0) {
            return resp.status(200).send({
                mensagem: "Nenhum livro marcado como 'estou lendo'.",
                livros: []
            });
        }

        return resp.status(200).send({
            quantidade: livros.length,
            livros: livros
        });

    } catch (err) {
        console.error("Erro no GET /usuario/biblioteca/estou-lendo:", err);

        return resp.status(500).send({
            erro: "Erro interno ao buscar os livros."
        });
    }
});


// Listar livros com status "concluido"
endPoints.get('/usuario/biblioteca/concluido', autenticar, async (req, resp) => {
    try {
        const usuarioId = req.usuario.id;

        const livros = await listarPorLivrosLidos(usuarioId);

        if (!livros || livros.length === 0) {
            return resp.status(200).send({
                mensagem: "Nenhum livro marcado como 'concluído'.",
                livros: []
            });
        }

        return resp.status(200).send({
            quantidade: livros.length,
            livros: livros
        });

    } catch (err) {
        console.error("Erro no GET /usuario/biblioteca/concluido:", err);

        return resp.status(500).send({
            erro: "Erro interno ao buscar os livros concluídos."
        });
    }
});


// Atualizar status do livro na biblioteca
endPoints.put('/usuario/biblioteca/status/:idLivro', autenticar, async (req, resp) => {
    try {
        const usuarioId = req.usuario.id;
        const idLivro = req.params.idLivro;
        const { status } = req.body;

        const statusValidos = ['quero ler', 'estou lendo', 'concluido'];

        if (!status || !statusValidos.includes(status)) {
            return resp.status(400).send({
                erro: "Status inválido. Use: 'quero ler', 'estou lendo' ou 'concluido'."
            });
        }

        // Verifica se o livro está na biblioteca
        const existe = await verificarLivroNaBiblioteca(usuarioId, idLivro);

        if (existe.length === 0) {
            return resp.status(404).send({
                erro: "Esse livro não está na biblioteca do usuário."
            });
        }

        // Atualiza o status
        const atualizado = await atualizarStatus(usuarioId, idLivro, status);

        return resp.send({
            mensagem: "Status atualizado com sucesso.",
            status: status,
            resultado: atualizado
        });

    } catch (err) {
        console.error("Erro no PUT /usuario/biblioteca/status:", err);

        return resp.status(500).send({
            erro: "Erro interno ao atualizar status."
        });
    }
});



export default endPoints;
