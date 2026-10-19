// Inicia a aplicação Express em uma porta livre escolhida pelo sistema.
// Assim, os testes podem enviar requisições HTTP sem ocupar uma porta fixa.
const startServer = (app) => new Promise((resolve) => {
    const server = app.listen(0, '127.0.0.1', () => {
        const { port } = server.address();
        resolve({
            // Monta a URL local e envia a requisição para a aplicação testada.
            request: (path, options) => fetch(`http://127.0.0.1:${port}${path}`, options),
            // Fecha o servidor depois dos testes para não deixar processos abertos.
            close: () => new Promise((done) => {
                server.close(done);
                server.closeAllConnections?.();
            })
        });
    });
});

// Cria as opções de uma requisição JSON, por exemplo POST ou PUT.
const json = (method, body) => ({
    method,
    headers: { 'content-type': 'application/json' },
    ...(body === undefined ? {} : { body: JSON.stringify(body) })
});

// Exporta as funções para que todas as suítes usem o mesmo auxiliar.
module.exports = { startServer, json };
