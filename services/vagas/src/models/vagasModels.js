// Importa o Mongoose, que usamos para definir a estrutura dos documentos.
const mongoose = require('mongoose');

// Schema = "molde" de uma vaga. Define os campos, os tipos e as validações.
const vagaSchema = new mongoose.Schema(
    {
        titulo: {
            type: String,
            required: [true, 'O título é obrigatório'],
            trim: true
        },
        descricao: {
            type: String,
            required: [true, 'A descrição é obrigatória'],
            trim: true
        },
        salario: {
            type: Number,
            required: [true, 'O salário é obrigatório'],
            min: [0, 'O salário não pode ser negativo']
        },
        modalidade: {
            type: String,
            required: [true, 'A modalidade é obrigatória'],
            // Só aceita um destes três valores.
            enum: {
                values: ['Presencial', 'Híbrido', 'Remoto'],
                message: 'Modalidade deve ser Presencial, Híbrido ou Remoto'
            }
        },
        cidade: {
            type: String,
            required: [true, 'A cidade é obrigatória'],
            trim: true
        },
        requisitos: {
            type: String,
            trim: true
        },
        // ID da empresa dona da vaga. Guardamos só o ID, porque a empresa
        // está em outro microserviço (por isso não usamos "ref").
        empresaId: {
            type: mongoose.Schema.Types.ObjectId,
            required: [true, 'O empresaId é obrigatório']
        },
        status: {
            type: String,
            enum: {
                values: ['ABERTA', 'FECHADA'],
                message: 'Status deve ser ABERTA ou FECHADA'
            },
            // Se não informar, a vaga já nasce aberta.
            default: 'ABERTA'
        }
    },
    {
        // Cria automaticamente os campos createdAt e updatedAt.
        timestamps: true
    }
);

// Cria o model "Vaga", ligado à collection "vagas" (o Mongoose coloca no plural).
module.exports = mongoose.model('Vaga', vagaSchema);