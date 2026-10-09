// Importa a biblioteca Express, que facilita a criação de servidores e rotas HTTP.
const express = require('express');

// Cria a aplicação Express, que será responsável por receber e responder às requisições.
const app = express();

// Configura o Express para interpretar requisições que enviam dados no formato JSON.
// Assim, podemos acessar esses dados por meio de req.body.
app.use(express.json());

// Cria a rota inicial (/) utilizando o método GET.
// Ela serve para verificar se o Gateway está funcionando.
// req representa a requisição recebida e res representa a resposta enviada.
app.get('/', (req, res) => {

    // Envia uma resposta no formato JSON informando que a API está funcionando.
    res.json({
        mensagem: 'API 8Jobs funcionando!'
    });
});

// Define a porta 3000, que será utilizada pelo servidor para receber requisições.
const PORT = 3000;

// Inicia o servidor Express na porta definida.
// A função de callback é executada quando o servidor começa a funcionar.
app.listen(PORT, () => {

    // Exibe uma mensagem no terminal confirmando que o Gateway está ativo.
    console.log(`Gateway 8Jobs rodando na porta ${PORT}`);
});
