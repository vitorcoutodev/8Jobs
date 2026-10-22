const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    // Frontend (Vite). A API é simulada pelo Cypress, não precisa de backend nem MongoDB.
    baseUrl: 'http://localhost:5173',
    specPattern: 'cypress/e2e/**/*.cy.js',
    supportFile: 'cypress/support/e2e.js',
    video: false,
    defaultCommandTimeout: 8000,
    retries: { runMode: 1, openMode: 0 },
  },
});
