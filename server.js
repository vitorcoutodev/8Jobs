require('dotenv').config();

const express = require('express');

const app = express();
app.use(express.json({ limit: '1mb' }));

const servicos = {
    empresas: process.env.EMPRESAS_URL || 'http://localhost:3001',
    vagas: process.env.VAGAS_URL || 'http://localhost:3002',
    candidatos: process.env.CANDIDATOS_URL || 'http://localhost:3003',
    candidaturas: process.env.CANDIDATURAS_URL || 'http://localhost:3004'
};

// O front-end (Vite) roda em outra porta durante o desenvolvimento.
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_ORIGIN || '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');

    if (req.method === 'OPTIONS') return res.sendStatus(204);
    next();
});

app.get('/', (req, res) => {
    res.json({ mensagem: 'API Gateway 8Jobs funcionando!' });
});

// Encaminha /api/<servico>/... ao microserviço correspondente.
app.use('/api', async (req, res) => {
    const caminho = req.originalUrl.replace(/^\/api/, '');
    const nomeServico = caminho.split('/').filter(Boolean)[0];
    const baseUrl = servicos[nomeServico];

    if (!baseUrl) {
        return res.status(404).json({ erro: 'Microserviço não encontrado' });
    }

    try {
        const opcoes = {
            method: req.method,
            headers: {
                accept: req.headers.accept || 'application/json',
                ...(req.headers.authorization ? { authorization: req.headers.authorization } : {})
            },
            signal: AbortSignal.timeout(15000)
        };

        if (req.body !== undefined && !['GET', 'HEAD'].includes(req.method)) {
            opcoes.headers['content-type'] = req.headers['content-type'] || 'application/json';
            opcoes.body = JSON.stringify(req.body);
        }

        const resposta = await fetch(`${baseUrl.replace(/\/$/, '')}${caminho}`, opcoes);
        const conteudo = await resposta.text();

        res.status(resposta.status);
        const tipoConteudo = resposta.headers.get('content-type');
        if (tipoConteudo) res.setHeader('Content-Type', tipoConteudo);
        if (resposta.status === 204 || resposta.status === 304) return res.end();
        return res.send(conteudo);
    } catch (erro) {
        const expirou = erro.name === 'TimeoutError' || erro.name === 'AbortError';
        return res.status(expirou ? 504 : 503).json({
            erro: expirou
                ? `Tempo limite ao aguardar o serviço de ${nomeServico}`
                : `Serviço de ${nomeServico} indisponível`
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Gateway 8Jobs rodando em http://localhost:${PORT}`);
});
