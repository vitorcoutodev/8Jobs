module.exports = {
    // Mantém a raiz do projeto como base apesar desta configuração estar em services/.
    rootDir: '..',
    // Executa os testes como código Node.js, pois eles chamam as APIs Express.
    testEnvironment: 'node',
    // Procura testes apenas dentro da pasta dos microserviços.
    roots: ['<rootDir>/services', '<rootDir>/gateway'],
    // Considera como teste qualquer arquivo com o final .test.js.
    testMatch: ['**/*.test.js'],
    // Limpa o histórico dos mocks entre os testes para evitar interferência.
    clearMocks: true
};
