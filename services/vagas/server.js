// Carrega as variáveis do arquivo .env para process.env.
// Precisa ser a primeira coisa do arquivo, antes de usar process.env.
require('dotenv').config({ path: require('path').join(__dirname, '.env') });

// Importa a aplicação Express (configurada no app.js).
const app = require('./src/app');

// Importa a função que conecta ao MongoDB.
const conectarBanco = require('./src/config/database');

// Porta definida no .env. Se não existir, usa 3002.
const PORT = process.env.PORT || 3002;

// Primeiro conecta ao banco, e só depois sobe o servidor.
conectarBanco().then(() => {
    app.listen(PORT, () => {
        console.log(`Serviço de vagas rodando em http://localhost:${PORT}`);
    });
});
