// Importa o model da vaga, que conversa com a collection "vagas" no MongoDB.
const Vaga = require('../models/vagasModels');

// Importa o cliente que consulta o serviço de empresas.
const { buscarEmpresa } = require('../clients/empresasClient');

// Converte cada tipo de erro no status HTTP correto.
// Padrão de resposta de erro de todos os serviços: { erro: "mensagem" }
const responderErro = (res, erro, mensagemPadrao) => {

    // O serviço de empresas está fora do ar.
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

    console.error(erro);
    return res.status(500).json({ erro: mensagemPadrao });
};

// Junta os dados da empresa responsável a uma vaga.
// Se o serviço de empresas estiver fora do ar, a vaga volta com empresa: null.
const anexarEmpresa = async (vaga) => {
    const dados = vaga.toObject();

    try {
        const empresa = await buscarEmpresa(vaga.empresaId);
        dados.empresa = empresa ? { _id: empresa._id, nome: empresa.nome, cidade: empresa.cidade } : null;
    } catch (erro) {
        dados.empresa = null;
    }

    return dados;
};

// GET /vagas
// Retorna todas as vagas, cada uma com os dados da empresa responsável.
const listar = async (req, res) => {
    try {
        const vagas = await Vaga.find();

        // Busca cada empresa uma única vez, mesmo que ela tenha várias vagas.
        const ids = [...new Set(vagas.map((v) => String(v.empresaId)))];
        const empresas = {};

        await Promise.all(ids.map(async (id) => {
            try {
                const empresa = await buscarEmpresa(id);
                empresas[id] = empresa ? { _id: empresa._id, nome: empresa.nome, cidade: empresa.cidade } : null;
            } catch (erro) {
                empresas[id] = null;
            }
        }));

        const resultado = vagas.map((v) => ({
            ...v.toObject(),
            empresa: empresas[String(v.empresaId)]
        }));

        res.status(200).json(resultado);
    } catch (erro) {
        responderErro(res, erro, 'Erro ao listar vagas');
    }
};

// GET /vagas/:id
// Retorna uma vaga específica, com os dados da empresa responsável.
const buscarPorId = async (req, res) => {
    try {
        const vaga = await Vaga.findById(req.params.id);

        if (!vaga) {
            return res.status(404).json({ erro: 'Vaga não encontrada' });
        }

        res.status(200).json(await anexarEmpresa(vaga));
    } catch (erro) {
        responderErro(res, erro, 'Erro ao buscar vaga');
    }
};

// POST /vagas
// Cadastra uma nova vaga. A empresa informada precisa existir.
const criar = async (req, res) => {
    try {
        const { empresaId } = req.body || {};

        // Se o empresaId faltar, o model devolve o erro 400 de validação.
        if (empresaId) {
            const empresa = await buscarEmpresa(empresaId);

            if (!empresa) {
                return res.status(400).json({ erro: 'Empresa não encontrada' });
            }
        }

        const vaga = await Vaga.create(req.body);

        // 201 = criado com sucesso.
        res.status(201).json(vaga);
    } catch (erro) {
        responderErro(res, erro, 'Erro ao cadastrar vaga');
    }
};

// PUT /vagas/:id
// Altera os dados de uma vaga existente.
const atualizar = async (req, res) => {
    try {
        const { empresaId } = req.body || {};

        // Se estiver trocando a empresa, ela também precisa existir.
        if (empresaId) {
            const empresa = await buscarEmpresa(empresaId);

            if (!empresa) {
                return res.status(400).json({ erro: 'Empresa não encontrada' });
            }
        }

        // new: true devolve a vaga já atualizada.
        // runValidators: true aplica as validações do model também na alteração.
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
        responderErro(res, erro, 'Erro ao atualizar vaga');
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
        responderErro(res, erro, 'Erro ao excluir vaga');
    }
};

// Exporta as funções para serem usadas no arquivo de rotas.
module.exports = { listar, buscarPorId, criar, atualizar, excluir };
