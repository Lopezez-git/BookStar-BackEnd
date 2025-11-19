import connection from "./connection.js";

export async function inserirUsuario(usuario) {

    // função para inserir usuario

    try {

        let comando = `INSERT into usuario(nome, username, email, senha_hash, bio, imagem_perfil, dataCriacao, dataAtualiza)
values(?, ?, ?, MD5(?),? , ? ,now(), now())`;

        //Query para inserir no banco (não esquecer o "await");

        let [info] = await connection.query(comando, [
            usuario.nome,
            usuario.username,
            usuario.email,
            usuario.senha,
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

    if(info.length > 0){

        return info[0];
    }
    else{
        return null;
    }
    
}

export default async function getPerfil(id_usuario) {

    try{

        let comando = `Select usuario.nome, usuario.imagem_perfil,
        count(usuario.id) as seguidores,
        count(usuario.id) as seguindo
        from usuario`;
    }
    catch(err){

    }
    
}