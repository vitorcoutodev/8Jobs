// Importa o Express.
const express = require('express');


// Cria a aplicação Express.
const app = express();


// Permite que o Express receba dados em formato JSON.
// Exemplo: { "nome": "Empresa ABC" }
app.use(express.json());


// Importa as rotas de empresas.
const empresaRoutes = require('./routes/empresaRoutes');


// Define que todas as rotas de empresa começarão com /empresas.
//
// Exemplo:
// router.get('/')     → GET /empresas
// router.get('/:id')  → GET /empresas/:id
app.use('/empresas', empresaRoutes);


// Exporta a aplicação.
// O server.js será responsável por iniciar o servidor.
module.exports = app;