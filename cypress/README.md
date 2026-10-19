# Testes E2E (Cypress) — 8Jobs, com API simulada

Não precisa de MongoDB, microserviços nem gateway. Só do frontend:

    npm run dev:frontend      # terminal 1
    npx cypress open          # terminal 2  (ou: npx cypress run)

A API é simulada em `cypress/support/fakeApi.js`, com as mesmas regras e mensagens de erro dos serviços.
