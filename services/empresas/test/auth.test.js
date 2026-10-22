// Simula o modelo para verificar que empresas entram com senha protegida.
jest.mock('../src/models/empresaModel', () => ({ findOne: jest.fn() }));

// Importa o helper de senha e a aplicação após configurar o modelo falso.
const { criarHashSenha } = require('../../shared/passwords');
const Empresa = require('../src/models/empresaModel');
const app = require('../src/app');
const { startServer, json } = require('../../testSupport/http');

// Inicia e encerra um servidor HTTP temporário para os testes.
let api;
beforeAll(async () => { api = await startServer(app); });
afterAll(async () => { await api.close(); });

// Confere o retorno seguro do endpoint que o gateway consulta.
test('valida credenciais empresariais e responde sem hash', async () => {
    const hash = await criarHashSenha('SenhaEmpresa2026!');
    Empresa.findOne.mockReturnValue({ select: jest.fn().mockResolvedValue({ _id: 'empresa-1', nome: 'Acme', email: 'rh@acme.com', senha: hash }) });
    const resposta = await api.request('/auth/verify', json('POST', { email: 'rh@acme.com', senha: 'SenhaEmpresa2026!' }));
    expect(resposta.status).toBe(200);
    expect(await resposta.json()).toEqual({ id: 'empresa-1', nome: 'Acme', email: 'rh@acme.com', role: 'empresa' });
});
