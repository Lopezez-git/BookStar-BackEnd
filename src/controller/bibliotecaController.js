import { Router } from "express";
import autenticar from "../middlewares/autenticar.js";
import { buscarLivroPorTitulo } from "../repository/livroRepository.js";

let endPoints = Router();


//add livro na biblioteca

endPoints.post('/usuario/biblioteca/post/:titulo', autenticar, async (req, resp) => {
    
    let tituloLivro = req.params.titulo;

    let usuario = req.usuario.id;

    //função de buscar livro por titulo

    let livro = await buscarLivroPorTitulo(tituloLivro);

    //função de inserir na biblioteca do usuario

});



export default endPoints;