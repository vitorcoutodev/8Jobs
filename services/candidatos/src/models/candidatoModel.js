//Schema: define os campos e as regras dos dados.
//required: true: torna o campo obrigatório.
//unique: true: impede que dois candidatos tenham o mesmo e-mail no índice do MongoDB.
//type: [String]: permite armazenar várias habilidades, como ["JavaScript", "Node.js"].
//mongoose.model(...): cria o modelo que usaremos para consultar e modificar candidatos.// Importa o Mongoose, que usamos para definir a estrutura dos documentos.
const mongoose = require('mongoose');

// Expressão simples para conferir se o e-mail tem o formato nome@dominio.com
const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Schema = "molde" de um candidato.
const candidatoSchema = new mongoose.Schema(
    {
        nome: {
            type: String,
            required: [true, 'O nome é obrigatório'],
            trim: true
        },
        email: {
            type: String,
            required: [true, 'O e-mail é obrigatório'],
            unique: true, // Impede e-mails duplicados.
            trim: true,
            lowercase: true,
            match: [emailValido, 'E-mail inválido']
        },
        telefone: {
            type: String,
            required: [true, 'O telefone é obrigatório'],
            trim: true
        },
        cidade: {
            type: String,
            required: [true, 'A cidade é obrigatória'],
            trim: true
        },
        habilidades: {
            type: [String],
            default: []
        }
    },
    {
        // Cria automaticamente os campos createdAt e updatedAt.
        timestamps: true
    }
);

module.exports = mongoose.model('Candidato', candidatoSchema);
