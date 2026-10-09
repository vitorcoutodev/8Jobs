// Importa o Model Empresa.
// É através dele que o Controller conversa com o MongoDB.
const Empresa = require('../models/empresaModel');


// GET /empresas
// Lista todas as empresas cadastradas.
const listarEmpresas = async (req, res) => {
    try {
        // Busca todas as empresas no banco de dados.
        const empresas = await Empresa.find();

        // Retorna as empresas encontradas em formato JSON.
        res.status(200).json(empresas);

    } catch (error) {
        // Caso aconteça algum erro, retorna status 500.
        res.status(500).json({
            mensagem: 'Erro ao listar empresas',
            erro: error.message
        });
    }
};


// GET /empresas/:id
// Consulta uma empresa específica pelo ID.
const consultarEmpresa = async (req, res) => {
    try {
        // Pega o ID que veio na URL.
        // Exemplo: /empresas/123 -> req.params.id = 123
        const { id } = req.params;

        // Procura a empresa pelo ID no MongoDB.
        const empresa = await Empresa.findById(id);

        // Se não encontrou nenhuma empresa, retorna 404.
        if (!empresa) {
            return res.status(404).json({
                mensagem: 'Empresa não encontrada'
            });
        }

        // Retorna a empresa encontrada.
        res.status(200).json(empresa);

    } catch (error) {
        // Erro ao consultar o banco.
        res.status(500).json({
            mensagem: 'Erro ao consultar empresa',
            erro: error.message
        });
    }
};


// POST /empresas
// Cadastra uma nova empresa.
const cadastrarEmpresa = async (req, res) => {
    try {
        // req.body contém os dados enviados pelo cliente.
        // Exemplo:
        // {
        //     "nome": "Empresa ABC",
        //     "cnpj": "12345678000100",
        //     "email": "contato@abc.com"
        // }

        const empresa = await Empresa.create(req.body);

        // 201 significa que um novo recurso foi criado.
        res.status(201).json(empresa);

    } catch (error) {
        // Erro ao cadastrar a empresa.
        res.status(500).json({
            mensagem: 'Erro ao cadastrar empresa',
            erro: error.message
        });
    }
};


// PUT /empresas/:id
// Altera uma empresa existente.
const alterarEmpresa = async (req, res) => {
    try {
        // Pega o ID da empresa na URL.
        const { id } = req.params;

        // Procura a empresa pelo ID e atualiza com os dados enviados.
        // { new: true } faz o Mongoose retornar a empresa já atualizada.
        const empresa = await Empresa.findByIdAndUpdate(
            id,
            req.body,
            { new: true }
        );

        // Se a empresa não existir, retorna 404.
        if (!empresa) {
            return res.status(404).json({
                mensagem: 'Empresa não encontrada'
            });
        }

        // Retorna a empresa atualizada.
        res.status(200).json(empresa);

    } catch (error) {
        // Erro ao alterar a empresa.
        res.status(500).json({
            mensagem: 'Erro ao alterar empresa',
            erro: error.message
        });
    }
};


// DELETE /empresas/:id
// Exclui uma empresa pelo ID.
const excluirEmpresa = async (req, res) => {
    try {
        // Pega o ID da empresa na URL.
        const { id } = req.params;

        // Procura e exclui a empresa.
        const empresa = await Empresa.findByIdAndDelete(id);

        // Se não encontrou a empresa, retorna 404.
        if (!empresa) {
            return res.status(404).json({
                mensagem: 'Empresa não encontrada'
            });
        }

        // 204 significa que a operação foi realizada
        // e não há conteúdo para retornar.
        res.status(204).send();

    } catch (error) {
        // Erro ao excluir a empresa.
        res.status(500).json({
            mensagem: 'Erro ao excluir empresa',
            erro: error.message
        });
    }
};


// Exporta todas as funções para que possam ser utilizadas pelas Routes.
module.exports = {
    listarEmpresas,
    consultarEmpresa,
    cadastrarEmpresa,
    alterarEmpresa,
    excluirEmpresa
};