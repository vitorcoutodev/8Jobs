// Importa o Express para configurar a aplicação.
const express = require('express');

// Libera o acesso ao serviço pelo frontend (que roda em outra porta).
const cors = require('cors');
const app = express();

// Permite que a API receba dados enviados em JSON.
app.use(cors());

app.use(express.json());

// Importa as rotas das candidaturas.
const candidaturaRoutes = require('./routes/candidaturaRoutes');

// Define o prefixo de todas as rotas deste microserviço.
app.use('/candidaturas', candidaturaRoutes);

// Exporta a aplicação para ser usada pelo server.js.
module.exports = app;