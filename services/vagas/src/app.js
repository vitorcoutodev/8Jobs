// Importa o Express.
const express = require('express');

// Importa as rotas de vagas.
const vagaRoutes = require('./routes/vagaRoutes');

// Cria a aplicação Express.
const app = express();

// Permite que o Express leia o corpo das requisições em JSON (req.body).
app.use(express.json());

// Rota simples para verificar se o serviço está no ar.
app.get('/', (req, res) => {
    res.json({ mensagem: 'Serviço de vagas funcionando!' });
});

// Todas as rotas do arquivo vagaRoutes ganham o prefixo /vagas.
// Ex.: router.get('/') vira GET /vagas, e router.get('/:id') vira GET /vagas/:id.
app.use('/vagas', vagaRoutes);

// Exporta o app para o server.js subir o servidor (e para o Jest usar nos testes).
module.exports = app;