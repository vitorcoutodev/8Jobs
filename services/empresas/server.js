// Importa o Express.
const express = require("express");
const { ObjectId } = require("mongodb");

// Importa nossa função de conexão com o MongoDB.
const conectarBanco = require("./src/config/database.js");

// Cria a aplicação Express.
const app = express();

// Define a porta do servidor.
const PORTA = 3001;

app.get('/', (req, res) => {

    // Envia uma resposta no formato JSON informando que a API está funcionando.
    res.json({
        mensagem: 'API empresas 8Jobs funcionando!'
    });
});

// Permite que o Express receba dados em JSON.
app.use(express.json());

// Inicia o servidor.
app.listen(PORTA, () => {
    console.log(`Servidor rodando em http://localhost:${PORTA}`);
});