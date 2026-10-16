// Cliente HTTP que consulta o microserviço de empresas.
// O serviço de vagas não acessa o banco de empresas: ele PERGUNTA ao serviço de empresas.

// Erro usado quando o outro serviço está fora do ar ou não responde.
class ServicoIndisponivelError extends Error {
    constructor(mensagem) {
        super(mensagem);
        this.name = 'ServicoIndisponivelError';
    }
}

// Endereço do serviço de empresas (vem do .env; se não existir, usa o padrão).
const urlEmpresas = () => process.env.EMPRESAS_URL || 'http://localhost:3001';

// Busca uma empresa pelo ID.
// Retorna os dados da empresa, ou null se ela não existir.
// Lança ServicoIndisponivelError se o serviço de empresas não responder.
const buscarEmpresa = async (id) => {
    let resposta;

    try {
        // Desiste se o serviço não responder em 5 segundos.
        resposta = await fetch(`${urlEmpresas()}/empresas/${id}`, {
            signal: AbortSignal.timeout(5000)
        });
    } catch (erro) {
        throw new ServicoIndisponivelError('Serviço de empresas indisponível');
    }

    // 404 = não existe, 400 = ID inválido: nos dois casos a empresa não existe.
    if (resposta.status === 404 || resposta.status === 400) {
        return null;
    }

    if (!resposta.ok) {
        throw new ServicoIndisponivelError('Serviço de empresas retornou um erro');
    }

    return resposta.json();
};

module.exports = { buscarEmpresa, ServicoIndisponivelError };
