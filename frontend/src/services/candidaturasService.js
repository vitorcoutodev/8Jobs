
 // Endereço da API do microserviço de candidaturas.
const API_URL = 'http://localhost:3004/candidaturas';

// Busca todas as candidaturas registradas.
export async function listarCandidaturas() {
  const resposta = await fetch(API_URL);

  // Verifica se a requisição foi bem-sucedida.
  if (!resposta.ok) {
    throw new Error('Não foi possível carregar as candidaturas.');
  }

  // Retorna os dados das candidaturas em formato JavaScript.
  return await resposta.json();
}

// Envia uma nova candidatura para a API.
export async function cadastrarCandidatura(dadosCandidatura) {
  const resposta = await fetch(API_URL, {
    method: 'POST', // Solicita a criação de uma candidatura.
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(dadosCandidatura),
  });

  // Trata erros de cadastro.
  if (!resposta.ok) {
    throw new Error('Não foi possível registrar a candidatura.');
  }

  // Retorna a resposta do backend.
  return await resposta.json();
}
