// Importa o model da vaga, que é quem conversa com a collection "vagas" no MongoDB.
const Vaga = require('../models/vagasModel');

// GET /vagas
// Retorna todas as vagas cadastradas.
const listar = async (req, res) => {
    try {
        // Busca todas as vagas no banco.
        const vagas = await Vaga.find();

        res.status(200).json(vagas);
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ erro: 'Erro ao listar vagas' });
    }
};

// GET /vagas/:id
// Retorna uma vaga específica pelo ID.
const buscarPorId = async (req, res) => {
    try {
        // req.params.id é o ID que veio na URL.
        const vaga = await Vaga.findById(req.params.id);

        // Se não achou nenhuma vaga, responde 404.
        if (!vaga) {
            return res.status(404).json({ erro: 'Vaga não encontrada' });
        }

        res.status(200).json(vaga);
    } catch (erro) {
        // CastError acontece quando o ID tem formato inválido.
        if (erro.name === 'CastError') {
            return res.status(400).json({ erro: 'ID inválido' });
        }

        console.error(erro);
        res.status(500).json({ erro: 'Erro ao buscar vaga' });
    }
};

// POST /vagas
// Cadastra uma nova vaga com os dados enviados no corpo da requisição.
const criar = async (req, res) => {
    try {
        // req.body são os dados enviados em JSON.
        const vaga = await Vaga.create(req.body);

        // 201 = criado com sucesso.
        res.status(201).json(vaga);
    } catch (erro) {
        // ValidationError acontece quando falta campo obrigatório ou o valor é inválido.
        if (erro.name === 'ValidationError') {
            return res.status(400).json({ erro: erro.message });
        }

        console.error(erro);
        res.status(500).json({ erro: 'Erro ao cadastrar vaga' });
    }
};

// PUT /vagas/:id
// Altera os dados de uma vaga existente.
const atualizar = async (req, res) => {
    try {
        // new: true devolve a vaga já atualizada.
        // runValidators: true aplica as validações do model também na atualização.
        const vaga = await Vaga.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!vaga) {
            return res.status(404).json({ erro: 'Vaga não encontrada' });
        }

        res.status(200).json(vaga);
    } catch (erro) {
        if (erro.name === 'ValidationError') {
            return res.status(400).json({ erro: erro.message });
        }
        if (erro.name === 'CastError') {
            return res.status(400).json({ erro: 'ID inválido' });
        }

        console.error(erro);
        res.status(500).json({ erro: 'Erro ao atualizar vaga' });
    }
};

// DELETE /vagas/:id
// Exclui uma vaga pelo ID.
const excluir = async (req, res) => {
    try {
        const vaga = await Vaga.findByIdAndDelete(req.params.id);

        if (!vaga) {
            return res.status(404).json({ erro: 'Vaga não encontrada' });
        }

        res.status(200).json({ mensagem: 'Vaga excluída com sucesso' });
    } catch (erro) {
        if (erro.name === 'CastError') {
            return res.status(400).json({ erro: 'ID inválido' });
        }

        console.error(erro);
        res.status(500).json({ erro: 'Erro ao excluir vaga' });
    }
};

// Exporta as funções para serem usadas no arquivo de rotas.
module.exports = { listar, buscarPorId, criar, atualizar, excluir };
