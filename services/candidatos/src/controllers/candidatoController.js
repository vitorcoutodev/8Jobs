// Importa o model do candidato, que conversa com a collection "candidatos" no MongoDB.
const Candidato = require('../models/candidatoModel');

// Converte cada tipo de erro no status HTTP correto.
// Padrão de resposta de erro de todos os serviços: { erro: "mensagem" }
const responderErro = (res, erro, mensagemPadrao) => {

    // Dado obrigatório faltando ou inválido.
    if (erro.name === 'ValidationError') {
        const mensagens = Object.values(erro.errors).map((e) => e.message);
        return res.status(400).json({ erro: mensagens.join('; ') });
    }

    // Valor com tipo errado (por exemplo, um ID mal formado).
    if (erro.name === 'CastError') {
        const mensagem = erro.path === '_id'
            ? 'ID inválido'
            : `Valor inválido para o campo ${erro.path}`;
        return res.status(400).json({ erro: mensagem });
    }

    // Código 11000 = valor duplicado em um campo único (ex.: e-mail).
    if (erro.code === 11000) {
        const campo = Object.keys(erro.keyPattern || {})[0] || 'campo';
        return res.status(409).json({ erro: `Já existe um candidato com este ${campo}` });
    }

    console.error(erro);
    return res.status(500).json({ erro: mensagemPadrao });
};

// GET /candidatos
const listarCandidatos = async (req, res) => {
    try {
        const candidatos = await Candidato.find();
        return res.status(200).json(candidatos);
    } catch (erro) {
        return responderErro(res, erro, 'Erro ao listar candidatos');
    }
};

// GET /candidatos/:id
const buscarCandidato = async (req, res) => {
    try {
        const candidato = await Candidato.findById(req.params.id);

        if (!candidato) {
            return res.status(404).json({ erro: 'Candidato não encontrado' });
        }

        return res.status(200).json(candidato);
    } catch (erro) {
        return responderErro(res, erro, 'Erro ao buscar candidato');
    }
};

// POST /candidatos
const criarCandidato = async (req, res) => {
    try {
        const candidato = await Candidato.create(req.body);
        return res.status(201).json(candidato);
    } catch (erro) {
        return responderErro(res, erro, 'Erro ao cadastrar candidato');
    }
};

// PUT /candidatos/:id
const atualizarCandidato = async (req, res) => {
    try {
        const candidato = await Candidato.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!candidato) {
            return res.status(404).json({ erro: 'Candidato não encontrado' });
        }

        return res.status(200).json(candidato);
    } catch (erro) {
        return responderErro(res, erro, 'Erro ao atualizar candidato');
    }
};

// DELETE /candidatos/:id
const excluirCandidato = async (req, res) => {
    try {
        const candidato = await Candidato.findByIdAndDelete(req.params.id);

        if (!candidato) {
            return res.status(404).json({ erro: 'Candidato não encontrado' });
        }

        return res.status(200).json({ mensagem: 'Candidato excluído com sucesso' });
    } catch (erro) {
        return responderErro(res, erro, 'Erro ao excluir candidato');
    }
};

module.exports = {
    listarCandidatos,
    buscarCandidato,
    criarCandidato,
    atualizarCandidato,
    excluirCandidato
};
