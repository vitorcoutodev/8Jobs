// Importa as dependências usadas pelo gateway, pelas sessões e pela API.
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const rateLimit = require('express-rate-limit');

// Cria o gateway e permite injetar um armazenamento em memória nos testes.
const criarGateway = ({ store, fetcher = global.fetch } = {}) => {
    if (process.env.NODE_ENV === 'production' && !process.env.SESSION_SECRET) {
        throw new Error('SESSION_SECRET precisa estar configurado em produção');
    }
    const app = express();
    const servicos = {
        empresas: process.env.EMPRESAS_URL || 'http://127.0.0.1:3001',
        vagas: process.env.VAGAS_URL || 'http://127.0.0.1:3002',
        candidatos: process.env.CANDIDATOS_URL || 'http://127.0.0.1:3003',
        candidaturas: process.env.CANDIDATURAS_URL || 'http://127.0.0.1:3004'
    };
    const origemFrontend = process.env.FRONTEND_ORIGIN || 'http://localhost:5173';
    const armazenamento = store || MongoStore.create({
        mongoUrl: process.env.MONGODB_URL || 'mongodb://127.0.0.1:27017',
        dbName: '8jobs_sessions',
        collectionName: 'sessions',
        ttl: 60 * 60 * 24 * 7
    });

    // Aceita cookies apenas do frontend configurado e habilita credenciais CORS.
    app.use(cors({ origin: origemFrontend, credentials: true, methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'] }));
    app.use(express.json({ limit: '1mb' }));
    app.use(session({
        name: '8jobs.sid',
        secret: process.env.SESSION_SECRET || 'somente-desenvolvimento-altere-esta-chave',
        store: armazenamento,
        resave: false,
        saveUninitialized: false,
        cookie: { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', maxAge: 7 * 24 * 60 * 60 * 1000 }
    }));
    const limitadorLogin = rateLimit({ windowMs: 15 * 60 * 1000, limit: 10, standardHeaders: true, legacyHeaders: false });

    // Publica um endereço simples de saúde para confirmar que o gateway iniciou.
    app.get('/', (_req, res) => res.json({ mensagem: 'API Gateway 8Jobs funcionando!' }));

    // Converte uma chamada interna do gateway em uma resposta JSON consistente.
    const chamarServico = async (url, corpo) => {
        try {
            const resposta = await fetcher(url, {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify(corpo),
                signal: AbortSignal.timeout(5000)
            });
            const dados = await resposta.json().catch(() => ({}));
            return { status: resposta.status, dados };
        } catch {
            return { status: 503, dados: { erro: 'Serviço de autenticação indisponível' } };
        }
    };

    // Permite validar a sessão da interface sem expor o identificador da sessão.
    app.get('/api/auth/me', (req, res) => {
        if (!req.session.usuario) return res.status(401).json({ erro: 'Faça login para continuar' });
        return res.json({ usuario: req.session.usuario });
    });

    // Valida a senha no microserviço dono da conta e cria uma sessão renovada.
    app.post('/api/auth/login', limitadorLogin, async (req, res) => {
        const { tipo, email, senha } = req.body || {};
        if (!['candidato', 'empresa'].includes(tipo) || !email || !senha) {
            return res.status(400).json({ erro: 'Informe o tipo de conta, e-mail e senha' });
        }
        const nomeServico = tipo === 'empresa' ? 'empresas' : 'candidatos';
        const validacao = await chamarServico(`${servicos[nomeServico]}/auth/verify`, { email, senha });
        if (validacao.status !== 200) return res.status(validacao.status).json(validacao.dados);

        return req.session.regenerate((erro) => {
            if (erro) return res.status(500).json({ erro: 'Não foi possível iniciar a sessão' });
            req.session.usuario = validacao.dados;
            return req.session.save((erroAoSalvar) => {
                if (erroAoSalvar) return res.status(500).json({ erro: 'Não foi possível salvar a sessão' });
                return res.json({ usuario: req.session.usuario });
            });
        });
    });

    // Encerra a sessão do lado do servidor e remove o cookie do navegador.
    app.post('/api/auth/logout', (req, res) => {
        req.session.destroy((erro) => {
            if (erro) return res.status(500).json({ erro: 'Não foi possível encerrar a sessão' });
            res.clearCookie('8jobs.sid', { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production' });
            return res.status(204).end();
        });
    });

    // Informa erros de autenticação antes de encaminhar dados aos microserviços.
    const exigirConta = (req, res, papeis = []) => {
        const usuario = req.session.usuario;
        if (!usuario) {
            res.status(401).json({ erro: 'Faça login para continuar' });
            return null;
        }
        if (papeis.length && !papeis.includes(usuario.role)) {
            res.status(403).json({ erro: 'Sua conta não tem permissão para esta ação' });
            return null;
        }
        return usuario;
    };

    // Confere a empresa responsável por uma vaga antes de permitir alterações.
    const empresaDonaDaVaga = async (id, empresaId) => {
        try {
            const resposta = await fetcher(`${servicos.vagas}/vagas/${encodeURIComponent(id)}`, { signal: AbortSignal.timeout(5000) });
            if (!resposta.ok) return false;
            const vaga = await resposta.json();
            return String(vaga.empresaId) === String(empresaId);
        } catch {
            return false;
        }
    };

    // Encaminha os recursos da API após aplicar as regras de acesso por papel.
    app.use('/api', async (req, res) => {
        let caminho = req.originalUrl.replace(/^\/api/, '');
        const partes = caminho.split('?')[0].split('/').filter(Boolean);
        const [recurso, id] = partes;
        const metodo = req.method;
        let usuario = req.session.usuario;

        if (recurso === 'candidatos' && metodo === 'GET' && !id) {
            usuario = exigirConta(req, res, ['empresa']);
            if (!usuario) return;
        } else if (recurso === 'candidatos' && id && ['GET', 'PUT', 'DELETE'].includes(metodo)) {
            usuario = exigirConta(req, res);
            if (!usuario) return;
            if (usuario.role === 'empresa' && metodo !== 'GET') {
                return res.status(403).json({ erro: 'Empresas podem apenas consultar perfis de candidatos' });
            }
            if (usuario.role !== 'empresa' && String(usuario.id) !== String(id)) {
                return res.status(403).json({ erro: 'Você só pode acessar o seu próprio cadastro' });
            }
        } else if (recurso === 'empresas' && metodo === 'POST') {
            // O cadastro inicial de empresa é público para permitir criar a primeira conta.
        } else if (recurso === 'empresas' && metodo === 'GET') {
            usuario = exigirConta(req, res, ['empresa']);
            if (!usuario) return;
            if (id && String(usuario.id) !== String(id)) return res.status(403).json({ erro: 'Você só pode consultar a sua empresa' });
            if (!id) caminho = `/empresas?id=${encodeURIComponent(usuario.id)}`;
        } else if (recurso === 'empresas' && ['PUT', 'DELETE'].includes(metodo)) {
            usuario = exigirConta(req, res, ['empresa']);
            if (!usuario) return;
            if (String(usuario.id) !== String(id)) return res.status(403).json({ erro: 'Você só pode alterar a sua empresa' });
        } else if (recurso === 'vagas' && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(metodo)) {
            usuario = exigirConta(req, res, ['empresa']);
            if (!usuario) return;
            if (metodo === 'POST') req.body.empresaId = usuario.id;
            if (id && !(await empresaDonaDaVaga(id, usuario.id))) {
                return res.status(403).json({ erro: 'Você só pode alterar vagas da sua empresa' });
            }
        } else if (recurso === 'candidaturas' && metodo === 'POST') {
            usuario = exigirConta(req, res, ['candidato']);
            if (!usuario) return;
            req.body.candidatoId = usuario.id;
        } else if (recurso === 'candidaturas' && ['GET', 'PUT', 'PATCH', 'DELETE'].includes(metodo)) {
            usuario = exigirConta(req, res, ['empresa', 'candidato']);
            if (!usuario) return;
            if (metodo !== 'GET' && usuario.role !== 'empresa') {
                return res.status(403).json({ erro: 'Somente uma conta empresarial pode alterar candidaturas' });
            }
            if (metodo === 'GET' && !id && usuario.role === 'candidato') {
                caminho = `/candidaturas?candidatoId=${encodeURIComponent(usuario.id)}`;
            }
            if (metodo === 'GET' && !id && usuario.role === 'empresa') {
                try {
                    const respostaVagas = await fetcher(`${servicos.vagas}/vagas`, { signal: AbortSignal.timeout(5000) });
                    if (!respostaVagas.ok) return res.status(503).json({ erro: 'Não foi possível consultar as vagas da empresa' });
                    const vagasDaEmpresa = (await respostaVagas.json()).filter((vaga) => String(vaga.empresaId) === String(usuario.id));
                    if (!vagasDaEmpresa.length) return res.json([]);
                    const idsVagas = vagasDaEmpresa.map((vaga) => vaga._id).join(',');
                    caminho = `/candidaturas?vagaIds=${encodeURIComponent(idsVagas)}`;
                } catch {
                    return res.status(503).json({ erro: 'Serviço de vagas indisponível' });
                }
            }
            if (id) {
                try {
                    const respostaCandidatura = await fetcher(`${servicos.candidaturas}/candidaturas/${encodeURIComponent(id)}`, { signal: AbortSignal.timeout(5000) });
                    if (!respostaCandidatura.ok) return res.status(respostaCandidatura.status).json(await respostaCandidatura.json().catch(() => ({})));
                    const candidatura = await respostaCandidatura.json();
                    const permitido = usuario.role === 'candidato'
                        ? String(candidatura.candidatoId) === String(usuario.id)
                        : await empresaDonaDaVaga(candidatura.vagaId, usuario.id);
                    if (!permitido) return res.status(403).json({ erro: 'Você não tem acesso a esta candidatura' });
                } catch {
                    return res.status(503).json({ erro: 'Não foi possível verificar o acesso à candidatura' });
                }
            }
        }

        const baseUrl = servicos[recurso];
        if (!baseUrl) return res.status(404).json({ erro: 'Microserviço não encontrado' });

        try {
            const opcoes = {
                method: metodo,
                headers: { accept: req.headers.accept || 'application/json' },
                signal: AbortSignal.timeout(15000)
            };
            if (req.body !== undefined && !['GET', 'HEAD'].includes(metodo)) {
                opcoes.headers['content-type'] = 'application/json';
                opcoes.body = JSON.stringify(req.body);
            }
            const resposta = await fetcher(`${baseUrl.replace(/\/$/, '')}${caminho}`, opcoes);
            const conteudo = await resposta.text();
            res.status(resposta.status);
            const tipo = resposta.headers.get('content-type');
            if (tipo) res.setHeader('Content-Type', tipo);
            if (resposta.status === 204 || resposta.status === 304) return res.end();
            return res.send(conteudo);
        } catch (erro) {
            const expirou = erro.name === 'TimeoutError' || erro.name === 'AbortError';
            return res.status(expirou ? 504 : 503).json({ erro: expirou ? `Tempo limite ao aguardar o serviço de ${recurso}` : `Serviço de ${recurso} indisponível` });
        }
    });

    // Retorna o aplicativo sem iniciar uma porta fixa, facilitando os testes HTTP.
    return app;
};

// Exporta a fábrica para o servidor real e para as suítes automatizadas.
module.exports = { criarGateway };
