//Importar todos os endPoints
import usuarioController from './controller/usuarioController.js'
import livroController from './controller/livroController.js'
import bibliotecaController from './controller/bibliotecaController.js'
import seguidorController from './controller/seguidorController.js'
import comentarioController from './controller/comentarioController.js'

export function rotas(servidor){

    //Usar todos os endPoints

    servidor.use(livroController);

    servidor.use(usuarioController);

    servidor.use(bibliotecaController);

    servidor.use(seguidorController);

    servidor.use(comentarioController);
}