import { Router } from "express";
import autenticar from "../middlewares/autenticar.js";
import { seguirUsuario, deixarDeSeguirUsuario } from "../repository/seguidorRepository.js";

let endPoints = Router();

endPoints.post('/usuario/seguir', autenticar, async (req, resp) => {
  try {
    const seguidor = req.usuario.id;
    const seguido = req.body.username;

    if (!seguido) {
      return resp.status(400).send({ sucesso: false, mensagem: 'Usuário a ser seguido não informado.' });
    }

    const saida = await seguirUsuario(seguidor, seguido);

    if (!saida.sucesso) {
      return resp.status(400).send(saida);
    }

    return resp.status(200).send(saida);
  } catch (error) {
    console.error('Erro ao seguir usuário:', error);
    return resp.status(500).send({
      sucesso: false,
      mensagem: 'Erro interno ao tentar seguir o usuário.'
    });
  }
});

endPoints.post('/usuario/deixar-de-seguir', autenticar, async (req, resp) => {
  try {
    const seguidor = req.usuario.id;
    const seguido = req.body.username;

    if (!seguido) {
      return resp.status(400).send({ sucesso: false, mensagem: 'Usuário a ser deixado de seguir não informado.' });
    }

    const saida = await deixarDeSeguirUsuario(seguidor, seguido);

    if (!saida.sucesso) {
      return resp.status(400).send(saida);
    }

    return resp.status(200).send(saida);
  } catch (error) {
    console.error('Erro ao deixar de seguir usuário:', error);
    return resp.status(500).send({
      sucesso: false,
      mensagem: 'Erro interno ao tentar deixar de seguir o usuário.'
    });
  }
});



export default endPoints;