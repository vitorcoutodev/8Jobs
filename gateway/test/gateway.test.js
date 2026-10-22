// Simula o MongoDB da sessão e as respostas internas dos microserviços.
const session = require('express-session');
const { criarGateway } = require('../app');
const { startServer, json } = require('../../services/testSupport/http');

// Gera respostas HTTP para simular os microserviços consultados pelo gateway.
const respostaJson = (dados, status = 200) => new Response(JSON.stringify(dados), {
    status,
    headers: { 'content-type': 'application/json' }
});

// Inicia um servidor de gateway isolado para cada cenário.
let api;
let chamadas;
beforeEach(async () => {
    chamadas = [];
    const fetcher = async (url, opcoes = {}) => {
        chamadas.push({ url, opcoes });
        if (String(url).endsWith('/auth/verify')) {
            const role = String(url).includes(':3001') ? 'empresa' : 'candidato';
            return respostaJson({ id: role === 'empresa' ? 'empresa-1' : 'candidato-1', nome: 'Conta de teste', email: 'teste@8jobs.com', role });
        }
        if (String(url).endsWith('/candidatos') && opcoes.method === 'GET') return respostaJson([{ _id: 'candidato-1', nome: 'Pessoa' }]);
        if (String(url).includes('/empresas?id=') && opcoes.method === 'GET') return respostaJson([{ _id: 'empresa-1', nome: 'Empresa teste' }]);
        if (String(url).endsWith('/vagas') && opcoes.method === 'GET') return respostaJson([]);
        return respostaJson(JSON.parse(opcoes.body || '{}'), 201);
    };
    const app = criarGateway({ store: new session.MemoryStore(), fetcher });
    api = await startServer(app);
});

// Libera a porta temporária após cada cenário.
afterEach(async () => api.close());

// Faz login e retorna o cookie que identifica a sessão segura do navegador.
const entrar = async (tipo = 'candidato') => {
    const resposta = await api.request('/api/auth/login', json('POST', { tipo, email: 'teste@8jobs.com', senha: 'SenhaTeste2026!' }));
    const cookie = resposta.headers.get('set-cookie')?.split(';')[0];
    return { resposta, cookie };
};

// Confere autenticação, permissões e associação segura dos registros.
describe('Gateway de autenticação e autorização', () => {
    test('bloqueia a lista de candidatos quando não existe sessão', async () => {
        const resposta = await api.request('/api/candidatos');
        expect(resposta.status).toBe(401);
    });

    test('encerra uma sessão e bloqueia novas consultas', async () => {
        const autenticada = await entrar('candidato');
        const logout = await api.request('/api/auth/logout', { method: 'POST', headers: { cookie: autenticada.cookie } });
        expect(logout.status).toBe(204);
        const sessao = await api.request('/api/auth/me', { headers: { cookie: autenticada.cookie } });
        expect(sessao.status).toBe(401);
    });

    test('permite lista de candidatos para empresa e nega para candidato', async () => {
        const candidato = await entrar('candidato');
        expect((await api.request('/api/candidatos', { headers: { cookie: candidato.cookie } })).status).toBe(403);
        const empresa = await entrar('empresa');
        const resposta = await api.request('/api/candidatos', { headers: { cookie: empresa.cookie } });
        expect(resposta.status).toBe(200);
        expect(await resposta.json()).toEqual([{ _id: 'candidato-1', nome: 'Pessoa' }]);
    });

    test('substitui empresaId no cadastro de vaga pelo ID da sessão', async () => {
        const empresa = await entrar('empresa');
        const resposta = await api.request('/api/vagas', json('POST', { titulo: 'Vaga protegida', empresaId: 'empresa-alheia' }));
        expect(resposta.status).toBe(401);
        const autenticada = await api.request('/api/vagas', {
            ...json('POST', { titulo: 'Vaga protegida', empresaId: 'empresa-alheia' }),
            headers: { 'content-type': 'application/json', cookie: empresa.cookie }
        });
        expect(autenticada.status).toBe(201);
        expect(JSON.parse(chamadas.at(-1).opcoes.body).empresaId).toBe('empresa-1');
    });

    test('substitui candidatoId no envio de candidatura pelo ID da sessão', async () => {
        const candidato = await entrar('candidato');
        const resposta = await api.request('/api/candidaturas', {
            ...json('POST', { candidatoId: 'candidato-alheio', vagaId: 'vaga-1' }),
            headers: { 'content-type': 'application/json', cookie: candidato.cookie }
        });
        expect(resposta.status).toBe(201);
        expect(JSON.parse(chamadas.at(-1).opcoes.body).candidatoId).toBe('candidato-1');
    });

    test('restringe consultas empresariais ao perfil da própria empresa', async () => {
        const candidato = await entrar('candidato');
        expect((await api.request('/api/empresas', { headers: { cookie: candidato.cookie } })).status).toBe(403);
        const empresa = await entrar('empresa');
        const resposta = await api.request('/api/empresas', { headers: { cookie: empresa.cookie } });
        expect(resposta.status).toBe(200);
        expect(chamadas.at(-1).url).toContain('id=empresa-1');
    });
});
