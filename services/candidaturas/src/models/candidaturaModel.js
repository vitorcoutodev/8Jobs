// Importa o Mongoose para definir o modelo da candidatura.
const mongoose = require('mongoose');

// Define os campos e as regras de cada candidatura.
const candidaturaSchema = new mongoose.Schema({
    // ID do candidato que está se inscrevendo.
    candidatoId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'O ID do candidato é obrigatório']
    },

    // ID da vaga para a qual o candidato se inscreveu.
    vagaId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'O ID da vaga é obrigatório']
    },

    // Data em que a candidatura foi registrada.
    data: {
        type: Date,
        default: Date.now
    },

    // Situação atual da candidatura no processo seletivo.
    status: {
        type: String,
        enum: ['ENVIADA', 'EM_ANALISE', 'APROVADA', 'REJEITADA'],
        default: 'ENVIADA',
        required: [true, 'O status da candidatura é obrigatório']
    }
}, {
    // Cria automaticamente os campos createdAt e updatedAt.
    timestamps: true
});

// Cria o modelo que permitirá consultar e modificar candidaturas.
const Candidatura = mongoose.model('Candidatura', candidaturaSchema);

// Exporta o modelo para ser usado pelo controller.
module.exports = Candidatura;