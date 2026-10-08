// Importa o MongoClient da biblioteca oficial do MongoDB.
// Ele é responsável por criar a conexão entre o Node.js e o MongoDB.
const { MongoClient } = require("mongodb");

// Endereço onde o MongoDB está rodando.
// localhost = este próprio computador
// 27017 = porta padrão do MongoDB
const url = "mongodb://localhost:27017";

// Cria um cliente MongoDB usando o endereço informado acima.
// Ainda não estamos conectados; apenas criamos o cliente.
const client = new MongoClient(url);

// Função responsável por realizar a conexão com o MongoDB.
// "async" permite utilizar "await" dentro da função.
async function conectarBanco() {

    try {
        // Tenta estabelecer a conexão com o MongoDB.
        // O "await" faz o Node esperar a conexão terminar.
        await client.connect();

        // Mostra uma mensagem no terminal caso a conexão tenha funcionado.
        console.log("MongoDB conectado!");

        // Seleciona o banco de dados "plataforma-vagas".
        // Se o banco ainda não existir, ele será criado quando
        // inserirmos algum dado nele.
        return client.db("plataforma-vagas");

    } catch (erro) {

        // Caso aconteça algum problema na conexão,
        // mostra o erro no terminal.
        console.error("Erro ao conectar ao MongoDB:", erro);
    }
}

// Exporta a função para que outros arquivos do projeto
// possam utilizá-la.
module.exports = conectarBanco;