
 // Endereço da API do microserviço de vagas.
const API_URL = 'http://localhost:3003/vagas';

// Busca as vagas cadastradas no backend.
export async function listarVagas() {
  const resposta = await fetch(API_URL);

  // Interrompe a operação se a API retornar um erro HTTP.
  if (!resposta.ok) {
    throw new Error('Não foi possível carregar as vagas.');
  }

  // Converte o JSON recebido em dados que o JavaScript pode utilizar.
  return await resposta.json();
}
