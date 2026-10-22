// Importa as funções compartilhadas que enviam pedidos para a API.
import { enviarJson, requisitarApi } from './api.js';

// Define o caminho do recurso de candidatos no gateway.
const RECURSO = '/candidatos';

// Solicita a lista de candidatos; o servidor valida se a sessão pode acessá-la.
export const listarCandidatos = () => requisitarApi(RECURSO);
// Busca os dados públicos de um candidato pelo ID para exibir numa candidatura.
export const buscarCandidato = (id) => requisitarApi(`${RECURSO}/${encodeURIComponent(id)}`);
// Envia os dados do novo candidato para a API usando o método HTTP POST.
export const cadastrarCandidato = (dados) => enviarJson(RECURSO, 'POST', dados);
