//  express.json() permite que a API leia dados JSON enviados no corpo das requisições.
//  app.use('/candidatos', candidatoRoutes) define o endereço base das rotas.
//  module.exports = app permite que o server.js utilize essa configuração.
//  Por exemplo, a rota router.get('/') que criamos anteriormente ficará disponível em GET /candidatos.


 // Importa o Express.
const express = require('express');

// Libera o acesso ao serviço pelo frontend (que roda em outra porta).
const cors = require('cors');

// Importa as rotas de candidatos.
const candidatoRoutes = require('./routes/candidatoRoutes');

// Cria a aplicacao Express.
const app = express();

// Permite receber dados em formato JSON.
app.use(cors());

app.use(express.json());

// Define as rotas de candidatos.
app.use('/candidatos', candidatoRoutes);

// Exporta a aplicacao.
module.exports = app;
