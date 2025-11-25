import { Router } from "express";

import getPerfil, { atualizarFotoDePerfil, inserirUsuario, verificarUsuario, showAllUsuarios } from "../repository/usuarioRepository.js";

import { gerarToken } from "../services/jwt.js";

import autenticar from "../middlewares/autenticar.js";

import multer from "multer";

import path from "path";

let endPoints = Router();

let uploadPErfil = multer({ dest: path.resolve('storage', 'perfil') });

//EndPoint de cadastro

endPoints.post('/usuario/cadastro', async (req, resp) => {

    try {
        let usuario = req.body;

        let saidaDb = await inserirUsuario(usuario);

        if (!saidaDb) {

            resp.status(400).send("Erro ao inserir");
        }
        else {
            resp.send({ mensagem: "Id do novo usuario: " + saidaDb });
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
        const { email, senha } = req.body;

        if (!email || !senha) {

            resp.status(400).send({ erro: 'Não está contendo uma das informações' })
        }

        let usuario = await verificarUsuario(email, senha);

        if (!usuario) {
            resp.status(400).send({ erro: 'Email ou senha incorretos' });
        }

        let token = gerarToken(usuario);

        if (!token) {

            resp.status(400).send({ erro: 'O token não foi gerado' })
        }

        resp.send({
            mensagem: 'Login realizado com sucesso',
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

endPoints.get('/usuario/perfil', autenticar, async (req, resp) => {

    try {

        let usuario = req.usuario;

        //função do repository para retornar as informações do usuario;

        let select = await getPerfil(usuario.id);

        if (select.length === 0) {

            return resp.status(400).send({ Erro: "Erro ao retornar usuario" });
        }

        resp.send(select[0])
    }
    catch (err) {

        console.log("Erro no controller", err);

    }

});


//Adicionando uma foto de perfil

endPoints.put('/usuario/perfil/capa', autenticar, uploadPErfil.single('imagem'), async (req, resp) => {

    let imagem = req.file.filename;

    console.log("Nome do arquivo: " + imagem);

    //função para salvar a imagem no banco

    let saida = await atualizarFotoDePerfil(imagem, req.usuario.id);

    if (saida.length === 0) {

        return resp.status(400).send({ Erro: "Erro ao atualizar a foto de perfil" });
    }

    resp.send(saida[0]);

});

endPoints.get('/usuario/all', autenticar, async (req, resp) => {

    try {
        let usuarioLogado = req.usuario.id;

        let usuarios = await showAllUsuarios(usuarioLogado);

        if (!usuarios || usuarios.length === 0) {
            return resp.status(404).send({ erro: "Nenhum usuário encontrado." });
        }

        resp.send(usuarios);

    } catch (err) {
        console.error("Erro no endpoint /usuario/all", err);
        resp.status(500).send({ erro: "Erro ao listar usuários." });
    }

});

export default endPoints;