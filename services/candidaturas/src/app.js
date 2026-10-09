// Importa o Express para configurar a aplicação.
const express = require('express');
const app = express();

// Permite que a API receba dados enviados em JSON.
app.use(express.json());

// Importa as rotas das candidaturas.
const candidaturaRoutes = require('./routes/candidaturaRoutes');

// Define o prefixo de todas as rotas deste microserviço.
app.use('/candidaturas', candidaturaRoutes);

// Exporta a aplicação para ser usada pelo server.js.
module.exports = app;