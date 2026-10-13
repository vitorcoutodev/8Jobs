
const express = require('express');

// Importa as funções responsáveis pelas operações de empresas.
const empresaController = require('../controllers/empresaController');

// Cria um roteador separado para as rotas de empresas.
const router = express.Router();

// Lista todas as empresas cadastradas.
router.get('/', empresaController.listarEmpresas);

// Cadastra uma nova empresa.
router.post('/', empresaController.cadastrarEmpresa);

// Consulta uma empresa pelo seu ID.
router.get('/:id', empresaController.consultarEmpresa);

// Atualiza os dados de uma empresa pelo seu ID.
router.put('/:id', empresaController.alterarEmpresa);

// Exclui uma empresa pelo seu ID.
router.delete('/:id', empresaController.excluirEmpresa);

// Exporta as rotas para serem utilizadas pelo app.js ou server.js.
module.exports = router;
