// Carrega as configurações locais antes de criar o gateway.
require('dotenv').config();

// Importa a fábrica que configura proxy, autenticação e sessões.
const { criarGateway } = require('./app');

// Usa a porta configurada ou a porta padrão do gateway local.
const PORT = process.env.PORT || 3000;

// Inicia a API pública do 8Jobs.
criarGateway().listen(PORT, '127.0.0.1', () => {
    console.log(`Gateway 8Jobs rodando em http://127.0.0.1:${PORT}`);
});
