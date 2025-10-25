//endPoints para inserir, atualizar, mostrar e deletar livros da biblioteca do usuario;

import { Router } from "express";
import autenticar from "../middlewares/autenticar";

const endPoints = Router();

endPoints.post('/usuario/biblioteca/post', autenticar, (req, resp) => {

    let usuario = req.usuario.id;

    //buscar pelo nome do livro(status: em desenvolvimento);
    
    let livro = req.body.titulo;
})


export default endPoints;