// Importa o Mongoose para conectar o Node.js ao MongoDB.
const mongoose = require('mongoose');

// Função responsável por conectar ao banco de dados.
const conectarBanco = async () => {
    try {
        // Conecta usando a URL definida no arquivo .env.
        await mongoose.connect(process.env.MONGODB_URI);

        console.log('MongoDB conectado com sucesso!');
    } catch (error) {
        // Mostra o erro caso a conexão falhe.
        console.error('Erro ao conectar ao MongoDB:', error.message);

        // Encerra a aplicação se não conseguir conectar ao banco.
        process.exit(1);
    }
};

// Exporta a função para ser usada pelo server.js.
module.exports = conectarBanco;