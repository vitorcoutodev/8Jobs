
 // Importa o modelo que permite acessar as candidaturas no MongoDB.
const Candidatura = require('../models/candidaturaModel');

// Lista todas as candidaturas cadastradas.
const listarCandidaturas = async (req, res) => {
    try {
        const candidaturas = await Candidatura.find();

        // Retorna a lista com status HTTP 200 (sucesso).
        return res.status(200).json(candidaturas);
    } catch (error) {
        // Informa um erro inesperado no servidor.
        return res.status(500).json({
            mensagem: 'Erro ao listar candidaturas.'
        });
    }
};

// Consulta uma candidatura pelo ID.
const consultarCandidatura = async (req, res) => {
    try {
        // Obtém o ID informado na URL.
        const { id } = req.params;

        const candidatura = await Candidatura.findById(id);

        // Verifica se a candidatura existe.
        if (!candidatura) {
            return res.status(404).json({
                mensagem: 'Candidatura não encontrada.'
            });
        }

        return res.status(200).json(candidatura);
    } catch (error) {
        // Um ID malformado pode causar erro no Mongoose.
        if (error.name === 'CastError') {
            return res.status(400).json({
                mensagem: 'ID da candidatura inválido.'
            });
        }

        return res.status(500).json({
            mensagem: 'Erro ao consultar candidatura.'
        });
    }
};

// Cadastra uma nova candidatura.
const cadastrarCandidatura = async (req, res) => {
    try {
        // Obtém os dados enviados no corpo da requisição.
        const { candidatoId, vagaId, status } = req.body;

        // Verifica se os campos obrigatórios foram informados.
        if (!candidatoId || !vagaId) {
            return res.status(400).json({
                mensagem: 'Informe o ID do candidato e o ID da vaga.'
            });
        }

        // Cria a candidatura; a data e o status têm valores padrão no modelo.
        const candidatura = await Candidatura.create({
            candidatoId,
            vagaId,
            ...(status && { status })
        });

        // Retorna a candidatura criada com status HTTP 201.
        return res.status(201).json(candidatura);
    } catch (error) {
        // Trata dados que não respeitam as regras do modelo.
        if (
            error.name === 'ValidationError' ||
            error.name === 'CastError'
        ) {
            return res.status(400).json({
                mensagem: 'Dados da candidatura inválidos.'
            });
        }

        return res.status(500).json({
            mensagem: 'Erro ao cadastrar candidatura.'
        });
    }
};

// Altera os dados de uma candidatura existente.
const alterarCandidatura = async (req, res) => {
    try {
        const { id } = req.params;

        // Atualiza os campos enviados e aplica as validações do modelo.
        const candidatura = await Candidatura.findByIdAndUpdate(
            id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!candidatura) {
            return res.status(404).json({
                mensagem: 'Candidatura não encontrada.'
            });
        }

        return res.status(200).json(candidatura);
    } catch (error) {
        if (
            error.name === 'ValidationError' ||
            error.name === 'CastError'
        ) {
            return res.status(400).json({
                mensagem: 'Dados inválidos para alteração.'
            });
        }

        return res.status(500).json({
            mensagem: 'Erro ao alterar candidatura.'
        });
    }
};

// Exclui uma candidatura pelo ID.
const excluirCandidatura = async (req, res) => {
    try {
        const { id } = req.params;

        const candidatura = await Candidatura.findByIdAndDelete(id);

        if (!candidatura) {
            return res.status(404).json({
                mensagem: 'Candidatura não encontrada.'
            });
        }

        // HTTP 204 indica que a exclusão ocorreu sem precisar retornar conteúdo.
        return res.status(204).send();
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({
                mensagem: 'ID da candidatura inválido.'
            });
        }

        return res.status(500).json({
            mensagem: 'Erro ao excluir candidatura.'
        });
    }
};

// Exporta as funções para que o arquivo de rotas possa utilizá-las.
module.exports = {
    listarCandidaturas,
    consultarCandidatura,
    cadastrarCandidatura,
    alterarCandidatura,
    excluirCandidatura
};