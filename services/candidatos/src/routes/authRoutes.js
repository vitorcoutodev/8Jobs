// Importa o Express e o controlador interno de autenticação.
const express = require('express');
const { verificarCredenciais } = require('../controllers/authController');

// Cria as rotas de autenticação deste serviço.
const router = express.Router();
router.post('/verify', verificarCredenciais);

// Exporta as rotas para o aplicativo Express.
module.exports = router;
