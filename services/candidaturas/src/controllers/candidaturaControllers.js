// Importa o model da candidatura, que conversa com a collection "candidaturas" no MongoDB.
const Candidatura = require('../models/candidaturaModel');

// Importa os clientes que consultam os serviços de candidatos e de vagas.
const { buscarCandidato, buscarVaga } = require('../clients/clienteHttp');

// Converte cada tipo de erro no status HTTP correto.
// Padrão de resposta de erro de todos os serviços: { erro: "mensagem" }
const responderErro = (res, erro, mensagemPadrao) => {

    // Algum dos outros serviços está fora do ar.
    if (erro.name === 'ServicoIndisponivelError') {
        return res.status(503).json({ erro: erro.message });
    }

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

    // Código 11000 = candidatura repetida (mesmo candidato na mesma vaga).
    if (erro.code === 11000) {
        return res.status(409).json({ erro: 'Este candidato já se candidatou a esta vaga' });
    }

    console.error(erro);
    return res.status(500).json({ erro: mensagemPadrao });
};

// GET /candidaturas
const listarCandidaturas = async (req, res) => {
    try {
        const filtro = {};
        if (req.query.candidatoId) filtro.candidatoId = req.query.candidatoId;
        if (req.query.vagaIds) filtro.vagaId = { $in: req.query.vagaIds.split(',').filter(Boolean) };
        const candidaturas = await Candidatura.find(filtro);
        return res.status(200).json(candidaturas);
    } catch (erro) {
        return responderErro(res, erro, 'Erro ao listar candidaturas');
    }
};

// GET /candidaturas/:id
const consultarCandidatura = async (req, res) => {
    try {
        const candidatura = await Candidatura.findById(req.params.id);

        if (!candidatura) {
            return res.status(404).json({ erro: 'Candidatura não encontrada' });
        }

        return res.status(200).json(candidatura);
    } catch (erro) {
        return responderErro(res, erro, 'Erro ao consultar candidatura');
    }
};

// POST /candidaturas
// Cria uma candidatura. O candidato e a vaga precisam existir, e a vaga precisa estar ABERTA.
const cadastrarCandidatura = async (req, res) => {
    try {
        const { candidatoId, vagaId } = req.body || {};

        if (!candidatoId || !vagaId) {
            return res.status(400).json({ erro: 'Informe o ID do candidato e o ID da vaga' });
        }

        // Pergunta ao serviço de candidatos se o candidato existe.
        const candidato = await buscarCandidato(candidatoId);
        if (!candidato) {
            return res.status(400).json({ erro: 'Candidato não encontrado' });
        }

        // Pergunta ao serviço de vagas se a vaga existe e está aberta.
        const vaga = await buscarVaga(vagaId);
        if (!vaga) {
            return res.status(400).json({ erro: 'Vaga não encontrada' });
        }
        if (vaga.status !== 'ABERTA') {
            return res.status(400).json({ erro: 'Esta vaga não está aberta para candidaturas' });
        }

        // O status inicial é sempre ENVIADA (definido no model).
        const candidatura = await Candidatura.create({ candidatoId, vagaId });
        return res.status(201).json(candidatura);
    } catch (erro) {
        return responderErro(res, erro, 'Erro ao cadastrar candidatura');
    }
};

// PUT /candidaturas/:id
// Altera apenas o status da candidatura. O candidato e a vaga não mudam.
const alterarCandidatura = async (req, res) => {
    try {
        const { status } = req.body || {};

        if (!status) {
            return res.status(400).json({ erro: 'Informe o novo status da candidatura' });
        }

        const candidatura = await Candidatura.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true, runValidators: true }
        );

        if (!candidatura) {
            return res.status(404).json({ erro: 'Candidatura não encontrada' });
        }

        return res.status(200).json(candidatura);
    } catch (erro) {
        return responderErro(res, erro, 'Erro ao alterar candidatura');
    }
};

// DELETE /candidaturas/:id
const excluirCandidatura = async (req, res) => {
    try {
        const candidatura = await Candidatura.findByIdAndDelete(req.params.id);

        if (!candidatura) {
            return res.status(404).json({ erro: 'Candidatura não encontrada' });
        }

        return res.status(200).json({ mensagem: 'Candidatura excluída com sucesso' });
    } catch (erro) {
        return responderErro(res, erro, 'Erro ao excluir candidatura');
    }
};

module.exports = {
    listarCandidaturas,
    consultarCandidatura,
    cadastrarCandidatura,
    alterarCandidatura,
    excluirCandidatura
};
