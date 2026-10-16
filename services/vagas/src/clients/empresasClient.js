class ServicoIndisponivelError extends Error {
    constructor(mensagem) {
        super(mensagem);
        this.name = 'ServicoIndisponivelError';
    }
}

const buscarEmpresa = async (id) => {
    let resposta;

    try {
        const baseUrl = process.env.EMPRESAS_URL || 'http://localhost:3001';
        resposta = await fetch(`${baseUrl.replace(/\/$/, '')}/empresas/${encodeURIComponent(id)}`, {
            signal: AbortSignal.timeout(5000)
        });
    } catch {
        throw new ServicoIndisponivelError('Serviço de empresas indisponível');
    }

    if (resposta.status === 400 || resposta.status === 404) return null;
    if (!resposta.ok) throw new ServicoIndisponivelError('Serviço de empresas retornou um erro');
    return resposta.json();
};

module.exports = { buscarEmpresa, ServicoIndisponivelError };
