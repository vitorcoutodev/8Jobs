# Testes E2E (Cypress) — 8Jobs, com API simulada

Não precisa de MongoDB, microserviços nem gateway. Só do frontend:

    npm run dev:frontend      # terminal 1
    npx cypress open --project . --config-file cypress/cypress.config.js  # terminal 2

A API é simulada em `cypress/support/fakeApi.js`, com respostas em memória para
cadastro de candidatos e empresas, login, publicação de vagas, consulta de vagas
e envio de candidaturas. Esses fluxos não substituem a integração real com MongoDB.
