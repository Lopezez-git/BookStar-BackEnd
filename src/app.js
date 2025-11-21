import 'dotenv/config'

import express from 'express';

import multer from 'multer';




import { rotas } from './routers.js';

import cors from 'cors'

let servidor = express();

// ultilizando cors para qualquer porta poder acesssar a API

servidor.use(cors());

servidor.use(express.json());

//Usando o arquivo de rotas (router.js);

rotas(servidor);

let PORT = process.env.PORT;

servidor.listen(PORT, () => console.log(`A porta -> ${PORT} <- está aberta`));