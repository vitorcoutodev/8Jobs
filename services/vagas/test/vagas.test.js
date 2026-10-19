// Simula o CORS, que não é o objeto destes testes.
jest.mock('cors', () => () => (_req, _res, next) => next(), { virtual: true });
// Substitui o acesso ao Mongo por funções falsas controladas pela suíte.
jest.mock('../src/models/vagasModels', () => ({
    find: jest.fn(), findById: jest.fn(), create: jest.fn(),
    findByIdAndUpdate: jest.fn(), findByIdAndDelete: jest.fn()
}));
// Simula a consulta HTTP que o serviço de vagas faz ao serviço de empresas.
jest.mock('../src/clients/empresasClient', () => ({ buscarEmpresa: jest.fn() }));

const Vaga = require('../src/models/vagasModels');
const { buscarEmpresa } = require('../src/clients/empresasClient');
const app = require('../src/app');
const { startServer, json } = require('../../testSupport/http');
const id = '507f1f77bcf86cd799439011';
// O controller chama toObject() para converter documentos Mongoose em objetos JSON.
const vaga = { _id: id, empresaId: id, titulo: 'Dev', toObject() { return { _id: id, empresaId: id, titulo: 'Dev' }; } };
let api;

// Inicia e encerra uma instância Express temporária para os testes HTTP.
beforeAll(async () => { api = await startServer(app); });
afterAll(async () => { await api.close(); });

// Agrupa os testes do microserviço de vagas.
describe('API de vagas', () => {
    // Confere que uma vaga retornada inclui também os dados da empresa consultada.
    test('lista vagas com dados da empresa e consulta vaga por ID', async () => {
        buscarEmpresa.mockResolvedValue({ _id: id, nome: 'Acme' });
        Vaga.find.mockResolvedValue([vaga]);
        Vaga.findById.mockResolvedValue(vaga);
        const list = await (await api.request('/vagas')).json();
        expect(list[0].empresa.nome).toBe('Acme');
        expect((await api.request(`/vagas/${id}`)).status).toBe(200);
    });

    // Testa criação e atualização válidas, além de exclusão de um ID inexistente.
    test('cadastra e atualiza quando a empresa existe; retorna 404 ao excluir ausente', async () => {
        buscarEmpresa.mockResolvedValue({ _id: id });
        Vaga.create.mockResolvedValue({ _id: id, titulo: 'Dev' });
        Vaga.findByIdAndUpdate.mockResolvedValue(vaga);
        Vaga.findByIdAndDelete.mockResolvedValue(null);
        expect((await api.request('/vagas', json('POST', { empresaId: id }))).status).toBe(201);
        expect((await api.request(`/vagas/${id}`, json('PUT', { empresaId: id }))).status).toBe(200);
        expect((await api.request(`/vagas/${id}`, { method: 'DELETE' })).status).toBe(404);
    });

    // Verifica erros vindos da empresa, do model e de um ID malformado.
    test('situações de erro: empresa ausente, serviço indisponível, validação e ID inválido', async () => {
        // Silencia a saída do erro interno esperado durante este teste.
        const log = jest.spyOn(console, 'error').mockImplementation(() => {});
        // A primeira resposta diz empresa inexistente; a segunda simula serviço fora do ar.
        buscarEmpresa.mockResolvedValueOnce(null).mockRejectedValueOnce(Object.assign(new Error('indisponível'), { name: 'ServicoIndisponivelError' }));
        Vaga.create.mockRejectedValueOnce(Object.assign(new Error(), { name: 'ValidationError', errors: { titulo: { message: 'Título obrigatório' } } }));
        Vaga.findById.mockRejectedValueOnce(Object.assign(new Error(), { name: 'CastError', path: '_id' }));
        expect((await api.request('/vagas', json('POST', { empresaId: id }))).status).toBe(400);
        expect((await api.request('/vagas', json('POST', { empresaId: id }))).status).toBe(503);
        expect((await api.request('/vagas', json('POST', {}))).status).toBe(400);
        expect((await api.request('/vagas/invalido')).status).toBe(400);
        // Restaura a saída normal do console.
        log.mockRestore();
    });
});
