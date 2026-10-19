// Simula o CORS, middleware que não é avaliado nestes cenários.
jest.mock('cors', () => () => (_req, _res, next) => next(), { virtual: true });
// Usa um model falso para testar a API sem iniciar o MongoDB.
jest.mock('../src/models/candidaturaModel', () => ({
    find: jest.fn(), findById: jest.fn(), create: jest.fn(),
    findByIdAndUpdate: jest.fn(), findByIdAndDelete: jest.fn()
}));
// Simula os clientes HTTP que consultam candidatos e vagas.
jest.mock('../src/clients/clienteHttp', () => ({ buscarCandidato: jest.fn(), buscarVaga: jest.fn() }));

const Candidatura = require('../src/models/candidaturaModel');
const { buscarCandidato, buscarVaga } = require('../src/clients/clienteHttp');
const app = require('../src/app');
const { startServer, json } = require('../../testSupport/http');
const id = '507f1f77bcf86cd799439011';
const candidatura = { _id: id, candidatoId: id, vagaId: id, status: 'ENVIADA' };
let api;

// Abre o servidor local de teste antes dos cenários e fecha ao final.
beforeAll(async () => { api = await startServer(app); });
afterAll(async () => { await api.close(); });

// Agrupa os cenários da API de candidaturas.
describe('API de candidaturas', () => {
    // Confere listagem, busca por ID e resposta 404 quando não existe candidatura.
    test('lista e consulta candidaturas, com 404 para registro ausente', async () => {
        Candidatura.find.mockResolvedValue([candidatura]);
        Candidatura.findById.mockResolvedValueOnce(candidatura).mockResolvedValueOnce(null);
        expect((await api.request('/candidaturas')).status).toBe(200);
        expect((await api.request(`/candidaturas/${id}`)).status).toBe(200);
        expect((await api.request(`/candidaturas/${id}`)).status).toBe(404);
    });

    // Verifica o fluxo principal: candidato existe, vaga está aberta e candidatura é criada.
    test('cria candidatura para candidato existente e vaga aberta', async () => {
        buscarCandidato.mockResolvedValue({ _id: id });
        buscarVaga.mockResolvedValue({ _id: id, status: 'ABERTA' });
        Candidatura.create.mockResolvedValue(candidatura);
        const response = await api.request('/candidaturas', json('POST', { candidatoId: id, vagaId: id }));
        expect(response.status).toBe(201);
        // Além do status HTTP, confirma que os IDs corretos foram enviados ao model.
        expect(Candidatura.create).toHaveBeenCalledWith({ candidatoId: id, vagaId: id });
    });

    // Verifica a alteração do status e a exclusão de uma candidatura existente.
    test('atualiza status e exclui candidatura', async () => {
        Candidatura.findByIdAndUpdate.mockResolvedValue({ ...candidatura, status: 'APROVADA' });
        Candidatura.findByIdAndDelete.mockResolvedValue(candidatura);
        expect((await api.request(`/candidaturas/${id}`, json('PUT', { status: 'APROVADA' }))).status).toBe(200);
        expect((await api.request(`/candidaturas/${id}`, { method: 'DELETE' })).status).toBe(200);
    });

    // Garante que o cadastro é recusado quando faltam IDs, as referências não existem,
    // a vaga está fechada ou um dos serviços consultados está indisponível.
    test('situações de erro: IDs ausentes, relações inexistentes, vaga fechada e dependência indisponível', async () => {
        // Cada chamada ao cliente falso consome a resposta configurada a seguir.
        buscarCandidato.mockResolvedValueOnce(null).mockResolvedValueOnce({ _id: id }).mockRejectedValueOnce(Object.assign(new Error('indisponível'), { name: 'ServicoIndisponivelError' }));
        buscarVaga.mockResolvedValueOnce({ _id: id, status: 'FECHADA' });
        expect((await api.request('/candidaturas', json('POST', {}))).status).toBe(400);
        expect((await api.request('/candidaturas', json('POST', { candidatoId: id, vagaId: id }))).status).toBe(400);
        expect((await api.request('/candidaturas', json('POST', { candidatoId: id, vagaId: id }))).status).toBe(400);
        expect((await api.request('/candidaturas', json('POST', { candidatoId: id, vagaId: id }))).status).toBe(503);
    });

    // Testa os erros ao salvar e buscar candidaturas.
    test('situações de erro: candidatura duplicada, validação e ID inválido', async () => {
        // O erro no log é esperado; o spy evita poluir o terminal.
        const log = jest.spyOn(console, 'error').mockImplementation(() => {});
        buscarCandidato.mockResolvedValue({ _id: id });
        buscarVaga.mockResolvedValue({ _id: id, status: 'ABERTA' });
        Candidatura.create.mockRejectedValueOnce({ code: 11000 }).mockRejectedValueOnce(Object.assign(new Error(), { name: 'ValidationError', errors: { status: { message: 'Status inválido' } } }));
        Candidatura.findById.mockRejectedValueOnce(Object.assign(new Error(), { name: 'CastError', path: '_id' }));
        expect((await api.request('/candidaturas', json('POST', { candidatoId: id, vagaId: id }))).status).toBe(409);
        expect((await api.request('/candidaturas', json('POST', { candidatoId: id, vagaId: id }))).status).toBe(400);
        expect((await api.request('/candidaturas/invalido')).status).toBe(400);
        // Restaura console.error para qualquer teste seguinte.
        log.mockRestore();
    });
});
