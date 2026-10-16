import { enviarJson, requisitarApi } from './api.js';

const RECURSO = '/vagas';

export const listarVagas = () => requisitarApi(RECURSO);
export const buscarVaga = (id) => requisitarApi(`${RECURSO}/${encodeURIComponent(id)}`);
export const cadastrarVaga = (dados) => enviarJson(RECURSO, 'POST', dados);
