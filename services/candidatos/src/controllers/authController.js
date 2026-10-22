// Importa o verificador nativo de hashes e o modelo de candidatos.
const { conferirSenha } = require('../../../shared/passwords');
const Candidato = require('../models/candidatoModel');

// Valida as credenciais sem devolver a senha nem o hash.
const verificarCredenciais = async (req, res) => {
    try {
        const email = String(req.body?.email || '').trim().toLowerCase();
        const senha = String(req.body?.senha || '');
        if (!email || !senha) return res.status(400).json({ erro: 'Informe e-mail e senha' });

        const candidato = await Candidato.findOne({ email }).select('+senha');
        if (!candidato || !(await conferirSenha(senha, candidato.senha))) {
            return res.status(401).json({ erro: 'E-mail ou senha incorretos' });
        }

        return res.status(200).json({ id: candidato._id, nome: candidato.nome, email: candidato.email, role: 'candidato' });
    } catch (erro) {
        console.error(erro);
        return res.status(500).json({ erro: 'Não foi possível validar as credenciais' });
    }
};

// Exporta a operação usada pelo gateway ao iniciar uma sessão.
module.exports = { verificarCredenciais };
