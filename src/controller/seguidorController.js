import { Router } from "express";
import autenticar from "../middlewares/autenticar.js";
import buscarSeguidores, { seguirUsuario, deixarDeSeguirUsuario, buscarSeguindo } from "../repository/seguidorRepository.js";

let endPoints = Router();

endPoints.post('/usuario/seguir', autenticar, async (req, resp) => {
  console.log('REQ.BODY RECEBIDO:', req.body);
  console.log('TIPO:', typeof req.body.id_seguido, req.body.id_seguido);

  const idSeguidor = req.usuario.id;
  const idSeguido = Number(req.body.id_seguido);

  if (!idSeguido) {
    return resp.status(400).send({
      sucesso: false,
      mensagem: 'ID do usuário a ser seguido não informado ou inválido.'
    });
  }

  const saida = await seguirUsuario(idSeguidor, idSeguido);

  if (!saida.sucesso) {
    return resp.status(400).send(saida);
  }

  return resp.status(200).send(saida);
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

endPoints.get('/usuario/show-seguidores', autenticar, async (req, resp) => {

  let usuario = req.usuario;

  let select = await buscarSeguidores(usuario.id);

  if (select.length === 0) {

    return resp.status(400).send({ mensagem: "Esse usuario não seguidores" });
  }

  resp.send(select);

})

endPoints.get('/usuario/seguindo', autenticar, async (req, resp) => {
  try {
    const idLogado = req.usuario.id;

    const lista = await buscarSeguindo(idLogado);

    return resp.status(200).send({ seguindo: lista });

  } catch (error) {
    console.error("Erro ao buscar seguindo:", error);
    return resp.status(500).send({ erro: "Erro ao buscar lista de seguindo." });
  }
});





export default endPoints;