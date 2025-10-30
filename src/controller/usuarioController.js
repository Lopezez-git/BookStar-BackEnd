import { Router } from "express";

import { inserirUsuario, verificarUsuario} from "../repository/usuarioRepository.js";

import {gerarToken} from "../services/jwt.js";

import { buscarLivros, buscarLivroPorId } from "../services/googleBooksService.js";

import { adicionarLivroBiblioteca,
     listarBibliotecaUsuario,
     atualizarStatusLivro,
      avaliarLivro,
      removerLivroBiblioteca,
       obterEstatisticasBiblioteca } from "../repository/bibliotecaRepository.js";

import autenticar from "../middlewares/autenticar.js";

let endPoints = Router();

//EndPoint de cadastro

endPoints.post('/usuario/cadastro', async (req, resp) => {

    try {
        let usuario = req.body;

        let saidaDb = await inserirUsuario(usuario);

        if (!saidaDb) {

            resp.status(400).send("Erro ao inserir");
        }
        else {
            resp.send(saidaDb);
        }
    }
    catch (err) {
        console.error("Deu erro no endPoint /usuario/post", err);
        resp.status(500).send("Dados já existentes");
    }

});

//endPoint de login

endPoints.post('/usuario/login', async (req, resp) => {
    //Em dev
    try {
        const {email, senha} = req.body;

        if (!email || !senha) {

            resp.status(400).send({ erro: 'Não está contendo uma das informações' })
        }

        let usuario = await verificarUsuario(email, senha);

        if(!usuario){
            resp.status(400).send({erro: 'Email ou senha incorretos'});
        }

        let token = gerarToken(usuario);

        if(!token){

            resp.status(400).send({erro: 'O token não foi gerado'})
        }

        resp.send({mensagem: 'Login realizado com sucesso',
            token,
            usuario: {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email
            }
        });


    } catch (err) {

    }
});



export default endPoints;