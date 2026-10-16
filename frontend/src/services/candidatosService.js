import { enviarJson, requisitarApi } from './api.js';

const RECURSO = '/candidatos';

export const listarCandidatos = () => requisitarApi(RECURSO);
export const cadastrarCandidato = (dados) => enviarJson(RECURSO, 'POST', dados);
