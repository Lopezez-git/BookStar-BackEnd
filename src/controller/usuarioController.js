import { Router } from "express";

import { inserirUsuario } from "../repository/usuarioRepository.js";

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
    catch(err){
        console.error("Deu erro no endPoint /usuario/post", err);
        resp.status(500).send("Dados já existentes");
    }

    
});


export default endPoints;