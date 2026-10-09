//Função	            O que faz
//listarCandidatos  	Busca todos os candidatos
//buscarCandidato	    Busca um candidato pelo ID
//criarCandidato     	Salva um candidato novo
//atualizarCandidato	Altera os dados de um candidato
//excluirCandidato	    Remove um candidato


// Importa o modelo de candidato.
const Candidato = require('../models/candidatoModel');

// Lista todos os candidatos.
const listarCandidatos = async (req, res) => {
    try {
        const candidatos = await Candidato.find();
        return res.status(200).json(candidatos);
    } catch (error) {
        return res.status(500).json({
            mensagem: 'Erro ao listar candidatos.',
            erro: error.message
        });
    }
};

// Busca um candidato pelo ID.
const buscarCandidato = async (req, res) => {
    try {
        const candidato = await Candidato.findById(req.params.id);

        if (!candidato) {
            return res.status(404).json({
                mensagem: 'Candidato nao encontrado.'
            });
        }

        return res.status(200).json(candidato);
    } catch (error) {
        return res.status(400).json({
            mensagem: 'ID invalido ou erro ao buscar candidato.',
            erro: error.message
        });
    }
};

// Cadastra um novo candidato.
const criarCandidato = async (req, res) => {
    try {
        const candidato = await Candidato.create(req.body);
        return res.status(201).json(candidato);
    } catch (error) {
        return res.status(400).json({
            mensagem: 'Erro ao cadastrar candidato.',
            erro: error.message
        });
    }
};

// Atualiza um candidato.
const atualizarCandidato = async (req, res) => {
    try {
        const candidato = await Candidato.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!candidato) {
            return res.status(404).json({
                mensagem: 'Candidato nao encontrado.'
            });
        }

        return res.status(200).json(candidato);
    } catch (error) {
        return res.status(400).json({
            mensagem: 'Erro ao atualizar candidato.',
            erro: error.message
        });
    }
};

// Exclui um candidato.
const excluirCandidato = async (req, res) => {
    try {
        const candidato = await Candidato.findByIdAndDelete(req.params.id);

        if (!candidato) {
            return res.status(404).json({
                mensagem: 'Candidato nao encontrado.'
            });
        }

        return res.status(200).json({
            mensagem: 'Candidato excluido com sucesso.'
        });
    } catch (error) {
        return res.status(400).json({
            mensagem: 'Erro ao excluir candidato.',
            erro: error.message
        });
    }
};

// Exporta as funcoes usadas pelas rotas.
module.exports = {
    listarCandidatos,
    buscarCandidato,
    criarCandidato,
    atualizarCandidato,
    excluirCandidato
};
