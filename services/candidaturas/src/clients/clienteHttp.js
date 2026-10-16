// Cliente HTTP que consulta os outros microserviços (candidatos e vagas).
// O serviço de candidaturas não acessa o banco dos outros: ele PERGUNTA a cada serviço.

// Erro usado quando o outro serviço está fora do ar ou não responde.
class ServicoIndisponivelError extends Error {
    constructor(mensagem) {
        super(mensagem);
        this.name = 'ServicoIndisponivelError';
    }
}

// Endereços dos serviços (vêm do .env; se não existirem, usa o padrão).
const urlCandidatos = () => process.env.CANDIDATOS_URL || 'http://localhost:3003';
const urlVagas = () => process.env.VAGAS_URL || 'http://localhost:3002';

// Busca um registro pelo ID em outro serviço.
// Retorna os dados, ou null se o registro não existir.
// Lança ServicoIndisponivelError se o serviço não responder.
const buscarPorId = async (baseUrl, recurso, id, nomeServico) => {
    let resposta;

    try {
        // Desiste se o serviço não responder em 5 segundos.
        resposta = await fetch(`${baseUrl}/${recurso}/${id}`, {
            signal: AbortSignal.timeout(5000)
        });
    } catch (erro) {
        throw new ServicoIndisponivelError(`Serviço de ${nomeServico} indisponível`);
    }

    // 404 = não existe, 400 = ID inválido: nos dois casos o registro não existe.
    if (resposta.status === 404 || resposta.status === 400) {
        return null;
    }

    if (!resposta.ok) {
        throw new ServicoIndisponivelError(`Serviço de ${nomeServico} retornou um erro`);
    }

    return resposta.json();
};

const buscarCandidato = (id) => buscarPorId(urlCandidatos(), 'candidatos', id, 'candidatos');
const buscarVaga = (id) => buscarPorId(urlVagas(), 'vagas', id, 'vagas');

module.exports = { buscarCandidato, buscarVaga, ServicoIndisponivelError };
