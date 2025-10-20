
import express from 'express';

let servidor = express();

let PORT = 5010;

servidor.listen(PORT, () => console.log("Servidor aberto na porta: " + PORT));