// Simula o modelo para testar somente validação das credenciais e resposta HTTP.
jest.mock('../src/models/candidatoModel', () => ({ findOne: jest.fn() }));

// Importa o helper de senha e a aplicação depois de configurar o modelo falso.
const { criarHashSenha } = require('../../shared/passwords');
const Candidato = require('../src/models/candidatoModel');
const app = require('../src/app');
const { startServer, json } = require('../../testSupport/http');

// Abre uma porta HTTP temporária para testar a rota interna do serviço.
let api;
beforeAll(async () => { api = await startServer(app); });
afterAll(async () => { await api.close(); });

// Verifica que uma senha correta autentica e uma senha errada é recusada.
describe('Autenticação de candidatos', () => {
    test('valida hash e não devolve senha nem hash', async () => {
        const hash = await criarHashSenha('SenhaTeste2026!');
        Candidato.findOne.mockReturnValue({ select: jest.fn().mockResolvedValue({ _id: 'candidato-1', nome: 'Ana', email: 'ana@teste.com', senha: hash }) });
        const correta = await api.request('/auth/verify', json('POST', { email: 'ana@teste.com', senha: 'SenhaTeste2026!' }));
        expect(correta.status).toBe(200);
        expect(await correta.json()).toEqual({ id: 'candidato-1', nome: 'Ana', email: 'ana@teste.com', role: 'candidato' });
        Candidato.findOne.mockReturnValue({ select: jest.fn().mockResolvedValue({ _id: 'candidato-1', nome: 'Ana', email: 'ana@teste.com', senha: hash }) });
        expect((await api.request('/auth/verify', json('POST', { email: 'ana@teste.com', senha: 'errada' }))).status).toBe(401);
    });
});
