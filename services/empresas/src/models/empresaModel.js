// Importa o Mongoose, que usamos para definir a estrutura dos documentos.
const mongoose = require('mongoose');

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
            trim: true,
            lowercase: true,
            match: [emailValido, 'E-mail inválido']
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

module.exports = mongoose.model('Empresa', empresaSchema);
