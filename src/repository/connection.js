import mysql from 'mysql2/promise'

//criando conexão com o banco

let connection = await mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DB
})

export default connection;