//Importar todos os endPoints
import usuarioController from './controller/usuarioController.js'
import livroController from './controller/livroController.js'

export function rotas(servidor){

    //Usar todos os endPoints

    servidor.use(livroController);

    servidor.use(usuarioController);
}