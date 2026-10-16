import { enviarJson, requisitarApi } from './api.js';

const RECURSO = '/empresas';

export const listarEmpresas = () => requisitarApi(RECURSO);
export const cadastrarEmpresa = (dados) => enviarJson(RECURSO, 'POST', dados);
