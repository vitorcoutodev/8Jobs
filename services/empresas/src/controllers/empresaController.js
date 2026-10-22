// Importa o model da empresa, que conversa com a collection "empresas" no MongoDB.
const Empresa = require('../models/empresaModel');

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

    // Código 11000 = valor duplicado em um campo único (ex.: CNPJ).
    if (erro.code === 11000) {
        const campo = Object.keys(erro.keyPattern || {})[0] || 'campo';
        return res.status(409).json({ erro: `Já existe uma empresa com este ${campo}` });
    }

    console.error(erro);
    return res.status(500).json({ erro: mensagemPadrao });
};

// GET /empresas
// Retorna todas as empresas cadastradas.
const listarEmpresas = async (req, res) => {
    try {
        const empresas = await Empresa.find(req.query.id ? { _id: req.query.id } : {});
        res.status(200).json(empresas);
    } catch (erro) {
        responderErro(res, erro, 'Erro ao listar empresas');
    }
};

// GET /empresas/:id
// Retorna uma empresa específica pelo ID.
const consultarEmpresa = async (req, res) => {
    try {
        const empresa = await Empresa.findById(req.params.id);

        if (!empresa) {
            return res.status(404).json({ erro: 'Empresa não encontrada' });
        }

        res.status(200).json(empresa);
    } catch (erro) {
        responderErro(res, erro, 'Erro ao consultar empresa');
    }
};

// POST /empresas
// Cadastra uma nova empresa.
const cadastrarEmpresa = async (req, res) => {
    try {
        const empresa = await Empresa.create(req.body);
        res.status(201).json(empresa);
    } catch (erro) {
        responderErro(res, erro, 'Erro ao cadastrar empresa');
    }
};

// PUT /empresas/:id
// Altera os dados de uma empresa.
const alterarEmpresa = async (req, res) => {
    try {
        if (Object.hasOwn(req.body || {}, 'senha')) {
            return res.status(400).json({ erro: 'A senha não pode ser alterada por esta rota' });
        }
        // new: true devolve a empresa já atualizada.
        // runValidators: true aplica as validações do model também na alteração.
        const empresa = await Empresa.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!empresa) {
            return res.status(404).json({ erro: 'Empresa não encontrada' });
        }

        res.status(200).json(empresa);
    } catch (erro) {
        responderErro(res, erro, 'Erro ao alterar empresa');
    }
};

// DELETE /empresas/:id
// Exclui uma empresa.
const excluirEmpresa = async (req, res) => {
    try {
        const empresa = await Empresa.findByIdAndDelete(req.params.id);

        if (!empresa) {
            return res.status(404).json({ erro: 'Empresa não encontrada' });
        }

        res.status(200).json({ mensagem: 'Empresa excluída com sucesso' });
    } catch (erro) {
        responderErro(res, erro, 'Erro ao excluir empresa');
    }
};

module.exports = {
    listarEmpresas,
    consultarEmpresa,
    cadastrarEmpresa,
    alterarEmpresa,
    excluirEmpresa
};
