import { Router } from "express";
import autenticar from "../middlewares/autenticar.js";
import { 
    buscarLivroPorTitulo
} from "../repository/livroRepository.js";
import { 
    salvarLivrosNaBiblioteca, 
    listarBibliotecaUsuario,
    removerLivroDaBiblioteca,
    verificarLivroNaBiblioteca
} from "../repository/bibliotecaRepository.js";

let endPoints = Router();


// 🟩 Adicionar livro à biblioteca
endPoints.post('/usuario/biblioteca/post/:titulo', autenticar, async (req, resp) => {
    try {
        const tituloLivro = req.params.titulo.trim();
        const usuarioId = req.usuario.id;

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

        const inserido = await salvarLivrosNaBiblioteca(usuarioId, livroId);

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


// 🟦 Listar biblioteca do usuário
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


// 🟥 Remover livro da biblioteca
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

export default endPoints;
