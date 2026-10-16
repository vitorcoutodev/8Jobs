// Carrega as variáveis de ambiente do arquivo .env.
require('dotenv').config({ path: require('path').join(__dirname, '.env') });

// Importa a aplicação Express configurada.
const app = require('./src/app');

// Importa a função de conexão com o MongoDB.
const conectarBanco = require('./src/config/database');

// Define a porta do microserviço, usando 3004 como padrão.
const PORT = process.env.PORT || 3004;

// Conecta ao banco antes de iniciar o servidor.
const iniciarServidor = async () => {
    await conectarBanco();

    // Inicia o servidor HTTP após a conexão com o banco.
    app.listen(PORT, () => {
        console.log(`Microserviço de candidaturas rodando na porta ${PORT}`);
    });
};

// Executa a inicialização.
iniciarServidor();
