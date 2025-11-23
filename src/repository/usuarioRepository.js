import connection from "./connection.js";

export async function inserirUsuario(usuario) {

    // função para inserir usuario

    try {

        let comando = `INSERT into usuario(nome, username, email, senha_hash,cpf, bio, imagem_perfil, dataCriacao, dataAtualiza)
values(?, ?, ?, MD5(?), ? ,? , ? ,now(), now())`;

        //Query para inserir no banco (não esquecer o "await");

        let [info] = await connection.query(comando, [
            usuario.nome,
            usuario.username,
            usuario.email,
            usuario.senha,
            usuario.cpf,
            usuario.bio || null,
            usuario.imagem_perfil || null]);

        return info.insertId;
    }
    catch (err) {

        console.error("Erro ao salvar usuário:", err);
        throw new Error("Erro ao cadastrar usuário");
    }
}

export async function buscarUsuarioPorEmail(email) {

    let comando = `select * from usuario WHERE email = ?`

    let [info] = await connection.query(comando, [email]);

    return info;
}

export async function verificarUsuario(email, senha) {

    let comando = `SELECT * from usuario where email = ? and senha_hash = MD5(?)`;

    let [info] = await connection.query(comando, [email, senha]);

    if (info.length > 0) {

        return info[0];
    }
    else {
        return null;
    }

}

export default async function getPerfil(id_usuario) {

    try {

        //Em dev

        let comando = `SELECT 
    u.id,
    u.nome,
    u.imagem_perfil,

    
    (
        SELECT COUNT(*) 
        FROM seguidores s 
        WHERE s.id_seguido = u.id
    ) AS seguidores,

    (
        SELECT COUNT(*) 
        FROM seguidores s 
        WHERE s.id_seguidor = u.id
    ) AS seguindo

FROM usuario u
WHERE u.id = ?;`;

        let [select] = await connection.query(comando, [id_usuario])

        return select;

    }
    catch (err) {
        console.log("Erro no servidor interno (Repository)", err);
    }

}

//Atualizar a foto de perfil e add no banco de dados

export async function atualizarFotoDePerfil(imagem, id_usuario) {
    
    let comando = `UPDATE usuario SET imagem_perfil = ? WHERE id = ?`;

    let [update] = await connection.query(comando, [imagem, id_usuario]);

    comando = `SELECT * FROM usuario WHERE id = ?`;

    let [select] = await connection.query(comando, [id_usuario]);

    return select;
}