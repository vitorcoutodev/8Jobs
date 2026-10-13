const mongoose = require('mongoose');

// Define a estrutura dos documentos da coleção de empresas.
const empresaSchema = new mongoose.Schema(
    {
        nome: {
            type: String
        },

        cnpj: {
            type: String,
            required: true, // O CNPJ é obrigatório.
            unique: true    // Impede CNPJs duplicados.
        },

        email: {
            type: String
        },

        telefone: {
            type: String
        },

        cidade: {
            type: String,
            required: true // A cidade é obrigatória.
        }
    },
    {
        timestamps: true // Cria automaticamente createdAt e updatedAt.
    }
);

// Cria e exporta o modelo Empresa para uso nos controllers.
module.exports = mongoose.model('Empresa', empresaSchema);