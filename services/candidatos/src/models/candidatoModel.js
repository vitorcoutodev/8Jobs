//Schema: define os campos e as regras dos dados.
//required: true: torna o campo obrigatório.
//unique: true: impede que dois candidatos tenham o mesmo e-mail no índice do MongoDB.
//type: [String]: permite armazenar várias habilidades, como ["JavaScript", "Node.js"].
//mongoose.model(...): cria o modelo que usaremos para consultar e modificar candidatos.// Importa o Mongoose, que usamos para definir a estrutura dos documentos.
const mongoose = require('mongoose');
const { criarHashSenha } = require('../../../shared/passwords');

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
        // Mantém o CPF como texto para preservar zeros à esquerda e exigir 11 dígitos.
        cpf: {
            type: String,
            required: [true, 'O CPF é obrigatório'],
            unique: true,
            sparse: true,
            trim: true,
            match: [/^\d{11}$/, 'O CPF deve conter 11 números sem pontuação'],
            select: false
        },
        email: {
            type: String,
            required: [true, 'O e-mail é obrigatório'],
            unique: true, // Impede e-mails duplicados.
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

// Protege a senha com scrypt antes de salvar o documento no MongoDB.
candidatoSchema.pre('save', async function () {
    if (this.isModified('senha')) this.senha = await criarHashSenha(this.senha);
});

// Remove o hash ao serializar o candidato em uma resposta JSON.
candidatoSchema.set('toJSON', {
    transform: (_documento, resultado) => {
        delete resultado.senha;
        // Não envia o CPF em respostas JSON para reduzir a exposição desse dado pessoal.
        delete resultado.cpf;
        delete resultado.__v;
        return resultado;
    }
});

module.exports = mongoose.model('Candidato', candidatoSchema);
