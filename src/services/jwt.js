import jwt from 'jsonwebtoken';

const SECRET_KEY = 'ehSegredo';

export function gerarToken(usuario) {

    const token = jwt.sign({
        id: usuario.id,
        email: usuario.email
    },
        SECRET_KEY,
        { expiresIn: '1h' });

        return token;

}
export function verificarToken(token){
    try{

        return jwt.verify(token, SECRET_KEY);
    }catch(err){

        throw new Error('token invalido ou expirado');
    }
}

export function decodificarToken(token){

    return jwt.decode(token);
}