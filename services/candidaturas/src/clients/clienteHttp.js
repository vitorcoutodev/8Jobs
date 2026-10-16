class ServicoIndisponivelError extends Error {
    constructor(mensagem) {
        super(mensagem);
        this.name = 'ServicoIndisponivelError';
    }
}

const buscarPorId = async (baseUrl, recurso, id, nomeServico) => {
    let resposta;

    try {
        resposta = await fetch(`${baseUrl.replace(/\/$/, '')}/${recurso}/${encodeURIComponent(id)}`, {
            signal: AbortSignal.timeout(5000)
        });
    } catch {
        throw new ServicoIndisponivelError(`Serviço de ${nomeServico} indisponível`);
    }

    if (resposta.status === 400 || resposta.status === 404) return null;
    if (!resposta.ok) throw new ServicoIndisponivelError(`Serviço de ${nomeServico} retornou um erro`);
    return resposta.json();
};

const buscarCandidato = (id) => buscarPorId(
    process.env.CANDIDATOS_URL || 'http://localhost:3003',
    'candidatos',
    id,
    'candidatos'
);

const buscarVaga = (id) => buscarPorId(
    process.env.VAGAS_URL || 'http://localhost:3002',
    'vagas',
    id,
    'vagas'
);

module.exports = { buscarCandidato, buscarVaga, ServicoIndisponivelError };
