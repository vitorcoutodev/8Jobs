// Importa as funções compartilhadas que enviam pedidos para a API.
import { enviarJson, requisitarApi } from './api.js';

// Define o caminho do recurso de candidaturas no gateway.
const RECURSO = '/candidaturas';

// Solicita as candidaturas que a sessão atual tem permissão para consultar.
export const listarCandidaturas = () => requisitarApi(RECURSO);
// Envia os dados de uma candidatura para a API usando o método HTTP POST.
export const cadastrarCandidatura = (dados) => enviarJson(RECURSO, 'POST', dados);
