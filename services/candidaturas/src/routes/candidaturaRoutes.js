// Importa o Express para criar as rotas.
const express = require('express');
const router = express.Router();

// Importa as funções responsáveis pelas operações das candidaturas.
const {
    listarCandidaturas,
    consultarCandidatura,
    cadastrarCandidatura,
    alterarCandidatura,
    excluirCandidatura
} = require('../controllers/candidaturaControllers');

// Lista todas as candidaturas.
router.get('/', listarCandidaturas);

// Consulta uma candidatura pelo ID.
router.get('/:id', consultarCandidatura);

// Cadastra uma nova candidatura.
router.post('/', cadastrarCandidatura);

// Altera uma candidatura existente pelo ID.
router.put('/:id', alterarCandidatura);

// Exclui uma candidatura pelo ID.
router.delete('/:id', excluirCandidatura);

// Exporta as rotas para serem utilizadas pelo app.js.
module.exports = router;