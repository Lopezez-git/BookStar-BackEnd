//Importar todos os endPoints
import usuarioController from './controller/usuarioController.js'

export function rotas(servidor){

    //Usar todos os endPoints

    servidor.use(usuarioController);
}