import connection from "./connection.js";

export async function inserirUsuario(usuario) {

    // função para inserir usuario

    try {

        let comando = `INSERT into usuario(nome, username, email, senha_hash, bio, imagem_perfil, dataCriacao, dataAtualiza)
values(?, ?, ?, MD5(?),? , ? ,now(), now())`;

        //Query para inserir no banco (não esquecer o "await");

        let [info] = await connection.query(comando, [usuario.nome,
        usuario.username,
        usuario.email,
        usuario.senha,
        usuario.bio || null,
        usuario.imagem_perfil || null]);

        return "usuario cadastrado: " + info.insertId;
    }
    catch (err) {
        
        console.error("Erro ao salvar usuário:", err);
        throw new Error("Erro ao cadastrar usuário");
    }
}