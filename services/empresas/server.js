// Importa o Express.
const express = require("express");
const { ObjectId } = require("mongodb");

// Importa nossa função de conexão com o MongoDB.
const conectarBanco = require("./src/database");

// Cria a aplicação Express.
const app = express();

// Define a porta do servidor.
const PORTA = 3001;

// Permite que o Express receba dados em JSON.
app.use(express.json());


// ROTA: GET /empresas
// Retorna todas as empresas cadastradas.
app.get("/empresas", async (req, res) => {

    try {
        // Conecta ao banco de dados.
        const banco = await conectarBanco();

        // Seleciona a collection "empresas".
        const empresas = banco.collection("empresas");

        // Busca todas as empresas e transforma o resultado em um array.
        const listaEmpresas = await empresas.find({}).toArray();

        // Envia as empresas como resposta JSON.
        res.json(listaEmpresas);

    } catch (erro) {

        // Mostra o erro no terminal.
        console.error(erro);

        // Retorna erro HTTP 500 para o cliente.
        res.status(500).json({
            erro: "Erro ao buscar empresas"
        });
    }
});

// ROTA: GET /empresas/:id
// Busca uma empresa específica pelo ID.
app.get("/empresas/:id", async (req, res) => {

    try {
        // Pega o ID que veio na URL.
        const id = req.params.id;

        // Mostra o ID recebido no terminal.
        console.log("ID recebido:", id);

        // Conecta ao banco de dados.
        const banco = await conectarBanco();

        // Seleciona a collection "empresas".
        const empresas = banco.collection("empresas");

        // Busca uma empresa pelo _id.
        const empresa = await empresas.findOne({
            _id: new ObjectId(id)
        });

        // Se não encontrou nenhuma empresa.
        if (!empresa) {
            return res.status(404).json({
                erro: "Empresa não encontrada"
            });
        }

        // Retorna a empresa encontrada.
        res.json(empresa);

    } catch (erro) {

        // Mostra o erro no terminal.
        console.error(erro);

        // Retorna erro para o cliente.
        res.status(500).json({
            erro: "Erro ao buscar empresa"
        });
    }
});


// Inicia o servidor.
app.listen(PORTA, () => {
    console.log(`Servidor rodando em http://localhost:${PORTA}`);
});