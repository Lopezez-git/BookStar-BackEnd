import 'dotenv/config'

import express from 'express';

import { rotas } from './routers.js';

import cors from 'cors'

let servidor = express();

servidor.use(cors());

servidor.use(express.json());

//Usando o arquivo de rotas (router.js)

rotas(servidor);

let PORT = process.env.PORT;

servidor.listen(PORT, () => console.log("Servidor aberto na porta: " + PORT));