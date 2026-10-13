// Importa o Express para usar o Router, que agrupa as rotas de um recurso.
const express = require('express');

// Importa as funções do controller.
const vagaController = require('../controllers/vagasControllers');

// Cria o roteador.
const router = express.Router();

// GET /vagas -> lista todas as vagas
router.get('/', vagaController.listar);

// GET /vagas/:id -> busca uma vaga pelo ID
router.get('/:id', vagaController.buscarPorId);

// POST /vagas -> cadastra uma nova vaga
router.post('/', vagaController.criar);

// PUT /vagas/:id -> altera uma vaga
router.put('/:id', vagaController.atualizar);

// DELETE /vagas/:id -> exclui uma vaga
router.delete('/:id', vagaController.excluir);

// Exporta o roteador para o app.js usar.
module.exports = router;