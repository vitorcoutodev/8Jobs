// Importa o verificador nativo de hashes e o modelo de empresas.
const { conferirSenha } = require('../../../shared/passwords');
const Empresa = require('../models/empresaModel');

// Valida as credenciais sem devolver a senha nem o hash.
const verificarCredenciais = async (req, res) => {
    try {
        const email = String(req.body?.email || '').trim().toLowerCase();
        const senha = String(req.body?.senha || '');
        if (!email || !senha) return res.status(400).json({ erro: 'Informe e-mail e senha' });

        const empresa = await Empresa.findOne({ email }).select('+senha');
        if (!empresa || !(await conferirSenha(senha, empresa.senha))) {
            return res.status(401).json({ erro: 'E-mail ou senha incorretos' });
        }

        return res.status(200).json({ id: empresa._id, nome: empresa.nome, email: empresa.email, role: 'empresa' });
    } catch (erro) {
        console.error(erro);
        return res.status(500).json({ erro: 'Não foi possível validar as credenciais' });
    }
};

// Exporta a operação usada pelo gateway ao iniciar uma sessão.
module.exports = { verificarCredenciais };
