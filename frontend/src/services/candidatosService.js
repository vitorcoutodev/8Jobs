
 // Endereço da API do microserviço de candidatos.
const API_URL = 'http://localhost:3002/candidatos';

// Busca os candidatos cadastrados.
export async function listarCandidatos() {
  const resposta = await fetch(API_URL);

  // Verifica se a API retornou uma resposta de sucesso.
  if (!resposta.ok) {
    throw new Error('Não foi possível carregar os candidatos.');
  }

  // Transforma o JSON recebido em um objeto JavaScript.
  return await resposta.json();
}

// Envia os dados para cadastrar um novo candidato.
export async function cadastrarCandidato(dadosCandidato) {
  const resposta = await fetch(API_URL, {
    method: 'POST', // Utiliza POST para criar um registro.
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(dadosCandidato),
  });

  // Trata possíveis erros retornados pela API.
  if (!resposta.ok) {
    throw new Error('Não foi possível cadastrar o candidato.');
  }

  // Retorna os dados recebidos após o cadastro.
  return await resposta.json();
}
