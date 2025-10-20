import 'dotenv/config'

import express from 'express';

let servidor = express();

let PORT = process.env.PORT;

servidor.listen(PORT, () => console.log("Servidor aberto na porta: " + PORT));