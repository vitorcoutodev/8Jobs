// Importa o Mongoose, que usamos para definir a estrutura dos documentos.
const mongoose = require('mongoose');

// Schema = "molde" de uma candidatura (liga um candidato a uma vaga).
const candidaturaSchema = new mongoose.Schema(
    {
        candidatoId: {
            type: mongoose.Schema.Types.ObjectId,
            required: [true, 'O ID do candidato é obrigatório']
        },
        vagaId: {
            type: mongoose.Schema.Types.ObjectId,
            required: [true, 'O ID da vaga é obrigatório']
        },
        data: {
            type: Date,
            default: Date.now
        },
        status: {
            type: String,
            enum: {
                values: ['ENVIADA', 'EM_ANALISE', 'APROVADA', 'REJEITADA'],
                message: 'Status deve ser ENVIADA, EM_ANALISE, APROVADA ou REJEITADA'
            },
            default: 'ENVIADA'
        }
    },
    {
        // Cria automaticamente os campos createdAt e updatedAt.
        timestamps: true
    }
);

// Um candidato só pode se candidatar uma vez a cada vaga.
candidaturaSchema.index({ candidatoId: 1, vagaId: 1 }, { unique: true });

module.exports = mongoose.model('Candidatura', candidaturaSchema);
