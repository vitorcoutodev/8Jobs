// Carrega as variáveis do arquivo .env (MONGODB_URI e PORT) para process.env.
// Precisa ser a primeira coisa do arquivo, antes de usar process.env.
require('dotenv').config({ path: require('path').join(__dirname, '.env') });

// Importa a aplicação Express (configurada em src/app.js, com as rotas de empresas).
const app = require('./src/app');

// Importa a função que conecta ao MongoDB (src/config/database.js).
const conectarBanco = require('./src/config/database');

// Porta definida no .env. Se não existir, usa 3001.
const PORT = process.env.PORT || 3001;

// Primeiro conecta ao banco, e só depois sobe o servidor.
// Se a conexão falhar, o database.js encerra o programa com process.exit(1).
conectarBanco().then(() => {

    // Inicia o servidor e fica esperando requisições na porta definida.
    app.listen(PORT, '127.0.0.1', () => {
        console.log(`Serviço de empresas rodando em http://localhost:${PORT}`);
    });
});
