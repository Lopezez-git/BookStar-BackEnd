import connection from "./connection.js";

export async function seguirUsuario(idSeguidor, idSeguido) {
  try {
    // Verifica se o usuário a ser seguido existe
    const [usuarioExiste] = await connection.query(
      'SELECT * FROM usuario WHERE id = ?',
      [idSeguido]
    );

    if (usuarioExiste.length === 0) {
      return { sucesso: false, mensagem: 'Usuário não encontrado.' };
    }

    // Verifica se já está seguindo
    const [jaSegue] = await connection.query(
      'SELECT * FROM seguidores WHERE id_seguidor = ? AND id_seguido = ?',
      [idSeguidor, idSeguido]
    );

    if (jaSegue.length > 0) {
      return { sucesso: false, mensagem: 'Você já segue esse usuário.' };
    }

    // Inserir novo registro
    await connection.query(
      'INSERT INTO seguidores (id_seguidor, id_seguido) VALUES (?, ?)',
      [idSeguidor, idSeguido]
    );

    return { sucesso: true, mensagem: 'Agora você está seguindo esse usuário!' };

  } catch (erro) {
    console.error('Erro ao seguir usuário:', erro);
    return { sucesso: false, mensagem: 'Erro ao seguir usuário.' };
  }
}


export async function deixarDeSeguirUsuario(seguidor, seguidoUsername) {
  try {
    // Verifica se o usuário a ser deixado de seguir existe
    const [usuario] = await connection.query(
      'SELECT id FROM usuario WHERE username = ?',
      [seguidoUsername]
    );

    if (usuario.length === 0) {
      return { sucesso: false, mensagem: 'Usuário não encontrado.' };
    }

    const seguidoId = usuario[0].id;

    // Verifica se realmente segue antes de remover
    const [segue] = await connection.query(
      'SELECT * FROM seguidores WHERE id_seguidor = ? AND id_seguido = ?',
      [seguidor, seguidoId]
    );

    if (segue.length === 0) {
      return { sucesso: false, mensagem: 'Você não segue esse usuário.' };
    }

    // Remove o vínculo
    await connection.query(
      'DELETE FROM seguidores WHERE id_seguidor = ? AND id_seguido = ?',
      [seguidor, seguidoId]
    );

    return { sucesso: true, mensagem: 'Você deixou de seguir o usuário.' };
  } catch (erro) {
    console.error('Erro ao deixar de seguir usuário:', erro);
    return { sucesso: false, mensagem: 'Erro interno ao tentar deixar de seguir o usuário.' };
  }
}

export default async function buscarSeguidores(id_seguido) {

  let comando = `SELECT seguidor.nome AS 'Quem Segue', seguido.nome AS 'Quem É Seguido'
FROM
    seguidores
    INNER JOIN usuario AS seguidor ON seguidores.id_seguidor = seguidor.id
    INNER JOIN usuario AS seguido ON seguidores.id_seguido = seguido.id
WHERE
    seguido.id = ?`;

  let [select] = await connection.query(comando, [id_seguido]);

  return select;
}

export async function buscarSeguindo(idSeguidor) {
  const comando = `
    SELECT 
      u.id,
      u.nome,
      u.username,
      u.imagem_perfil
    FROM seguidores s
    INNER JOIN usuario u ON s.id_seguido = u.id
    WHERE s.id_seguidor = ?;
  `;

  const [select] = await connection.query(comando, [idSeguidor]);
  return select;
}



