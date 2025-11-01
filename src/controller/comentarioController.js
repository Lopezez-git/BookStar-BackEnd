import { Router } from "express";
import autenticar from "../middlewares/autenticar.js";
import { comentar } from "../repository/comentarioRepository.js";

const endPoints = Router();

endPoints.post('/usuario/comentario/post', autenticar, async(req, resp)=> {

    const usuario = req.usuario.id;

    const livro = req.body.titulo;

    const comentario = req.body.texto;

    let comando = await comentar(usuario, livro, comentario);

    resp.send(comando);


})

export default endPoints;