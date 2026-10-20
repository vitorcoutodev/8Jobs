// database/conexao.js
// Arquivo de apoio: guarda o jeito de conectar no MongoDB.
// Os dois scripts da pasta (criar-banco.js e popular-banco.js) usam este arquivo,
// assim a conexão fica escrita em um lugar só.

const path = require('path');

// Lê o arquivo .env da raiz do projeto (onde pode ficar a variável MONGODB_URL).
// "quiet" evita mensagens extras no terminal.
require('dotenv').config({ path: path.join(__dirname, '..', '.env'), quiet: true });

const mongoose = require('mongoose');

// Endereço do SERVIDOR MongoDB (sem o nome de um banco no final).
// Se não houver MONGODB_URL no .env, usa o MongoDB local.
const URL_SERVIDOR = process.env.MONGODB_URL || 'mongodb://localhost:27017';

// Os 4 bancos do projeto: cada microserviço tem o SEU banco.
// Estes nomes precisam ser os mesmos que aparecem no final do MONGODB_URI
// do .env de cada serviço (ex.: services/vagas/.env -> .../8jobs_vagas).
const BANCOS = {
    empresas: '8jobs_empresas',
    vagas: '8jobs_vagas',
    candidatos: '8jobs_candidatos',
    candidaturas: '8jobs_candidaturas'
};

// Conecta ao servidor MongoDB. Se não conseguir em 5 segundos, explica o motivo e encerra.
// Devolve uma função: banco('vagas') entrega o banco 8jobs_vagas, e assim por diante.
const conectar = async () => {
    try {
        await mongoose.connect(URL_SERVIDOR, { serverSelectionTimeoutMS: 5000 });
        console.log(`Conectado ao servidor MongoDB: ${URL_SERVIDOR}\n`);

        const cliente = mongoose.connection.getClient();
        return (servico) => cliente.db(BANCOS[servico]);
    } catch (erro) {
        console.error('Não foi possível conectar ao MongoDB.');
        console.error('Verifique se o MongoDB está ligado (sudo systemctl start mongod)');
        console.error(`e se o endereço está certo: ${URL_SERVIDOR}`);
        console.error(`Motivo técnico: ${erro.message}`);
        process.exit(1);
    }
};

module.exports = { mongoose, conectar, BANCOS };
