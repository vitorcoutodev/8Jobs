 //Schema: define os campos e as regras dos dados.
 //required: true: torna o campo obrigatório.
 //unique: true: impede que dois candidatos tenham o mesmo e-mail no índice do MongoDB.
 //type: [String]: permite armazenar várias habilidades, como ["JavaScript", "Node.js"].
 //mongoose.model(...): cria o modelo que usaremos para consultar e modificar candidatos.

 
// Importa o Mongoose.
const mongoose = require('mongoose');

// Define a estrutura dos dados do candidato.
const candidatoSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true, 
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    telefone: {
        type: String,
        required: true
    },

    cidade: {
        type: String,
        required: true
    },

    habilidades: {
        type: [String],
        default: []
    }
});

// Cria e exporta o modelo.
module.exports = mongoose.model('Candidato', candidatoSchema);
