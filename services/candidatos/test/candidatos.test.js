// Simula o middleware CORS porque ele não faz parte do comportamento verificado aqui.
jest.mock('cors', () => () => (_req, _res, next) => next(), { virtual: true });
// Troca o model real por funções falsas, evitando conexão com MongoDB.
jest.mock('../src/models/candidatoModel', () => ({
    find: jest.fn(), findById: jest.fn(), create: jest.fn(),
    findByIdAndUpdate: jest.fn(), findByIdAndDelete: jest.fn()
}));

const Candidato = require('../src/models/candidatoModel');
const app = require('../src/app');
const { startServer, json } = require('../../testSupport/http');
const id = '507f1f77bcf86cd799439011';
const candidato = { _id: id, nome: 'Ana' };
let api;

// Abre o servidor de teste antes da suíte e fecha ao terminar.
beforeAll(async () => { api = await startServer(app); });
afterAll(async () => { await api.close(); });

// Reúne os cenários da API de candidatos.
describe('API de candidatos', () => {
    // Verifica listagem, busca por ID e resposta 404 quando o candidato não existe.
    test('lista, consulta e responde 404 quando não encontra candidato', async () => {
        Candidato.find.mockResolvedValue([candidato]);
        Candidato.findById.mockResolvedValueOnce(candidato).mockResolvedValueOnce(null);
        expect((await api.request('/candidatos')).status).toBe(200);
        expect(await (await api.request(`/candidatos/${id}`)).json()).toEqual(candidato);
        expect((await api.request(`/candidatos/${id}`)).status).toBe(404);
    });

    // Verifica cadastro, atualização e exclusão com respostas de sucesso.
    test('cadastra, atualiza e exclui candidato', async () => {
        Candidato.create.mockResolvedValue(candidato);
        Candidato.findByIdAndUpdate.mockResolvedValue(candidato);
        Candidato.findByIdAndDelete.mockResolvedValue(candidato);
        expect((await api.request('/candidatos', json('POST', candidato))).status).toBe(201);
        expect((await api.request(`/candidatos/${id}`, json('PUT', candidato))).status).toBe(200);
        expect((await api.request(`/candidatos/${id}`, { method: 'DELETE' })).status).toBe(200);
    });

    // Exercita os principais erros de validação e de persistência.
    test('situações de erro: validação, ID inválido, duplicidade e falha interna', async () => {
        // Evita imprimir no terminal o erro interno que este teste provoca de propósito.
        const log = jest.spyOn(console, 'error').mockImplementation(() => {});
        // Configura as falhas esperadas para cada operação do model falso.
        const validation = Object.assign(new Error(), { name: 'ValidationError', errors: { nome: { message: 'Nome obrigatório' } } });
        Candidato.create.mockRejectedValueOnce(validation).mockRejectedValueOnce({ code: 11000, keyPattern: { email: 1 } });
        Candidato.findById.mockRejectedValueOnce(Object.assign(new Error(), { name: 'CastError', path: '_id' }));
        Candidato.find.mockRejectedValueOnce(new Error('banco indisponível'));
        expect((await api.request('/candidatos', json('POST', {}))).status).toBe(400);
        expect((await api.request('/candidatos', json('POST', {}))).status).toBe(409);
        expect((await api.request('/candidatos/invalido')).status).toBe(400);
        expect((await api.request('/candidatos')).status).toBe(500);
        // Devolve console.error ao comportamento normal.
        log.mockRestore();
    });
});
