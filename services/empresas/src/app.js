// Importa o Express.
const express = require('express');

// Libera o acesso ao serviço pelo frontend (que roda em outra porta).
const cors = require('cors');


// Cria a aplicação Express.
const app = express();


// Permite que o Express receba dados em formato JSON.
// Exemplo: { "nome": "Empresa ABC" }
app.use(cors());

app.use(express.json());


// Importa as rotas de empresas.
const empresaRoutes = require('./routes/empresaRoutes');
const authRoutes = require('./routes/authRoutes');


// Define que todas as rotas de empresa começarão com /empresas.
//
// Exemplo:
// router.get('/')     → GET /empresas
// router.get('/:id')  → GET /empresas/:id
app.use('/empresas', empresaRoutes);
app.use('/auth', authRoutes);


// Exporta a aplicação.
// O server.js será responsável por iniciar o servidor.
module.exports = app;
