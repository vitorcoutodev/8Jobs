// Importa o Mongoose para conectar ao MongoDB.
const mongoose = require('mongoose');

// Cria a função responsável pela conexão com o banco.
const conectarBanco = async () => {
    try {
        // Conecta usando a URL definida no arquivo .env.
        await mongoose.connect(process.env.MONGODB_URI);

        console.log('MongoDB conectado com sucesso!');
    } catch (error) {
        // Mostra o motivo caso a conexão falhe.
        console.error('Erro ao conectar ao MongoDB:', error.message);

        // Encerra a aplicação se não conseguir conectar.
        process.exit(1);
    }
};

// Exporta a função para o server.js.
module.exports = conectarBanco;