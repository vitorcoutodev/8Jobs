// Importa as funções compartilhadas que enviam pedidos para a API.
import { enviarJson, requisitarApi } from './api.js';

// Define o caminho do recurso de vagas no gateway.
const RECURSO = '/vagas';

// Busca a lista de vagas disponível na API.
export const listarVagas = () => requisitarApi(RECURSO);
// Busca os detalhes de uma vaga e codifica o ID para uso seguro na URL.
export const buscarVaga = (id) => requisitarApi(`${RECURSO}/${encodeURIComponent(id)}`);
// Envia os dados de uma nova vaga usando o método HTTP POST.
export const cadastrarVaga = (dados) => enviarJson(RECURSO, 'POST', dados);
