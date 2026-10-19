// O CORS não é o foco destes testes; este middleware simulado só encaminha a requisição.
jest.mock('cors', () => () => (_req, _res, next) => next(), { virtual: true });
// Substitui o model do Mongo por funções falsas controladas pelo teste.
jest.mock('../src/models/empresaModel', () => ({
    find: jest.fn(), findById: jest.fn(), create: jest.fn(),
    findByIdAndUpdate: jest.fn(), findByIdAndDelete: jest.fn()
}));

const Empresa = require('../src/models/empresaModel');
const app = require('../src/app');
const { startServer, json } = require('../../testSupport/http');
const id = '507f1f77bcf86cd799439011';
const empresa = { _id: id, nome: 'Acme' };
let api;

// Cria um erro parecido com o que o Mongoose gera para dados inválidos.
const erroValidacao = () => Object.assign(new Error('inválido'), {
    name: 'ValidationError', errors: { nome: { message: 'Nome obrigatório' } }
});

// Executa antes de todos os testes: inicia o servidor Express em uma porta temporária.
beforeAll(async () => { api = await startServer(app); });
// Executa depois de todos os testes: encerra o servidor temporário.
afterAll(async () => { await api.close(); });

// Agrupa os cenários relacionados à API de empresas.
describe('API de empresas', () => {
    // Confere que a listagem e a busca retornam sucesso, e que um ID sem registro retorna 404.
    test('lista, consulta e retorna 404 para empresa ausente', async () => {
        // Define de antemão o que o model falso vai responder em cada chamada.
        Empresa.find.mockResolvedValue([empresa]);
        Empresa.findById.mockResolvedValueOnce(empresa).mockResolvedValueOnce(null);
        expect((await api.request('/empresas')).status).toBe(200);
        expect(await (await api.request(`/empresas/${id}`)).json()).toEqual(empresa);
        expect((await api.request(`/empresas/${id}`)).status).toBe(404);
    });

    // Verifica os três métodos de escrita e os códigos HTTP esperados.
    test('cadastra, atualiza e exclui empresa', async () => {
        Empresa.create.mockResolvedValue(empresa);
        Empresa.findByIdAndUpdate.mockResolvedValue(empresa);
        Empresa.findByIdAndDelete.mockResolvedValue(empresa);
        expect((await api.request('/empresas', json('POST', empresa))).status).toBe(201);
        expect((await api.request(`/empresas/${id}`, json('PUT', empresa))).status).toBe(200);
        expect((await api.request(`/empresas/${id}`, { method: 'DELETE' })).status).toBe(200);
    });

    // Confere como a API transforma falhas do model em respostas HTTP.
    test('situações de erro: validação, ID inválido, duplicidade e falha interna', async () => {
        // Silencia console.error neste cenário: o erro 500 é esperado pelo teste.
        const log = jest.spyOn(console, 'error').mockImplementation(() => {});
        // Cada rejeição é usada na próxima chamada à função correspondente.
        Empresa.create.mockRejectedValueOnce(erroValidacao()).mockRejectedValueOnce({ code: 11000, keyPattern: { cnpj: 1 } });
        Empresa.findById.mockRejectedValueOnce(Object.assign(new Error(), { name: 'CastError', path: '_id' }));
        Empresa.find.mockRejectedValueOnce(new Error('banco indisponível'));
        expect((await api.request('/empresas', json('POST', {}))).status).toBe(400);
        expect((await api.request('/empresas', json('POST', {}))).status).toBe(409);
        expect((await api.request('/empresas/invalido')).status).toBe(400);
        expect((await api.request('/empresas')).status).toBe(500);
        // Restaura o console para não afetar outros testes.
        log.mockRestore();
    });
});
