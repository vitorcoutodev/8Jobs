import { enviarJson, requisitarApi } from './api.js';

const RECURSO = '/candidaturas';

export const listarCandidaturas = () => requisitarApi(RECURSO);
export const cadastrarCandidatura = (dados) => enviarJson(RECURSO, 'POST', dados);
