
 // Carrega as variaveis do arquivo .env.
require('dotenv').config({ path: require('path').join(__dirname, '.env') });

// Importa a aplicacao Express.
const app = require('./src/app');

// Importa a funcao de conexao com o MongoDB.
const conectarBanco = require('./src/config/database');

// Define a porta do servidor.
const PORT = process.env.PORT || 3003;

// Inicia o servidor depois de conectar ao banco.
const iniciarServidor = async () => {
    try {
        await conectarBanco();

        app.listen(PORT, () => {
            console.log(`Servidor de candidatos rodando na porta ${PORT}`);
        });
    } catch (error) {
        console.error('Erro ao iniciar o servidor:', error.message);
        process.exit(1);
    }
};

// Executa a inicializacao.
iniciarServidor();
