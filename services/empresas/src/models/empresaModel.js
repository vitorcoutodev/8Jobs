// Importa o Mongoose, que usamos para definir a estrutura dos documentos.
const mongoose = require('mongoose');
const { criarHashSenha } = require('../../../shared/passwords');

// Expressão simples para conferir se o e-mail tem o formato nome@dominio.com
const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Schema = "molde" de uma empresa. Define os campos, os tipos e as validações.
const empresaSchema = new mongoose.Schema(
    {
        nome: {
            type: String,
            required: [true, 'O nome é obrigatório'],
            trim: true
        },
        cnpj: {
            type: String,
            required: [true, 'O CNPJ é obrigatório'],
            unique: true, // Impede CNPJs duplicados.
            trim: true
        },
        email: {
            type: String,
            required: [true, 'O e-mail é obrigatório'],
            unique: true,
            trim: true,
            lowercase: true,
            match: [emailValido, 'E-mail inválido']
        },
        senha: {
            type: String,
            required: [true, 'A senha é obrigatória'],
            minlength: [8, 'A senha deve ter pelo menos 8 caracteres'],
            select: false
        },
        telefone: {
            type: String,
            trim: true
        },
        cidade: {
            type: String,
            required: [true, 'A cidade é obrigatória'],
            trim: true
        }
    },
    {
        // Cria automaticamente os campos createdAt e updatedAt.
        timestamps: true
    }
);

// Protege a senha com scrypt antes de persistir o cadastro da empresa.
empresaSchema.pre('save', async function () {
    if (this.isModified('senha')) this.senha = await criarHashSenha(this.senha);
});

// Garante que o hash e metadados internos nunca sejam enviados ao frontend.
empresaSchema.set('toJSON', {
    transform: (_documento, resultado) => {
        delete resultado.senha;
        delete resultado.__v;
        return resultado;
    }
});

module.exports = mongoose.model('Empresa', empresaSchema);
