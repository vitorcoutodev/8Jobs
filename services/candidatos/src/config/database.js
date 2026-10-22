// Faz a conexão do microserviço de candidatos com o banco de dados MongoDB usando Mongoose.
// Importa o Mongoose para conectar o Node.js ao MongoDB.
const mongoose = require('mongoose');

// Funcao responsavel por conectar ao banco de dados.
const conectarBanco = async () => {
    try {
        // Conecta usando a URL definida no arquivo .env.
        await mongoose.connect(process.env.MONGODB_URI);

        // Exibe uma mensagem quando a conexao for bem-sucedida.
        console.log('MongoDB conectado com sucesso!');
    } catch (error) {
        // Mostra o erro caso a conexao falhe.
        console.error('Erro ao conectar ao MongoDB:', error.message);

        // Encerra a aplicacao se nao conseguir conectar ao banco.
        process.exit(1);
    }
};

// Exporta a funcao para ser usada pelo server.js.
module.exports = conectarBanco;
