import { Router } from "express";
import axios from "axios";;
import { formatarData } from "../services/dataFormat.js";

let endPoints = Router();

//endPoint para popular o bando de dados dos livros

endPoints.post('/livro/post', (req, resp) => {


})



export default endPoints;