// Método	Caminho	         Função
// GET 	    /candidatos 	 Lista candidatos
// GET	    /candidatos/:id	 Busca por ID
// POST	    /candidatos	     Cadastra candidato
// PUT	    /candidatos/:id  Atualiza candidato
// DELETE	/candidatos/:id	 Exclui candidato

 // Importa o Express.
const express = require('express');

// Cria um sistema de rotas.
const router = express.Router();

// Importa as funcoes do controller.
const candidatoController = require('../controllers/candidatoController');

// Lista todos os candidatos.
router.get('/', candidatoController.listarCandidatos);

// Busca um candidato pelo ID.
router.get('/:id', candidatoController.buscarCandidato);

// Cadastra um novo candidato.
router.post('/', candidatoController.criarCandidato);

// Atualiza um candidato pelo ID.
router.put('/:id', candidatoController.atualizarCandidato);

// Exclui um candidato pelo ID.
router.delete('/:id', candidatoController.excluirCandidato);

// Exporta as rotas.
module.exports = router;



