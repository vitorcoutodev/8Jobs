// Importa as funções compartilhadas que enviam pedidos para a API.
import { enviarJson, requisitarApi } from './api.js';

// Define o caminho do recurso de empresas no gateway.
const RECURSO = '/empresas';

// Solicita a lista de empresas; o servidor decide quais registros a sessão pode ver.
export const listarEmpresas = () => requisitarApi(RECURSO);
// Envia os dados de uma nova empresa para a API usando o método HTTP POST.
export const cadastrarEmpresa = (dados) => enviarJson(RECURSO, 'POST', dados);
