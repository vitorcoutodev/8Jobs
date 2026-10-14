
 // Endereço da API do microserviço de empresas.
const API_URL = 'http://localhost:3001/empresas';

// Busca todas as empresas cadastradas.
export async function listarEmpresas() {
  const resposta = await fetch(API_URL);

  // Verifica se a requisição foi concluída com sucesso.
  if (!resposta.ok) {
    throw new Error('Não foi possível carregar as empresas.');
  }

  // Converte a resposta JSON em dados JavaScript.
  return await resposta.json();
}

// Envia os dados de uma nova empresa para a API.
export async function cadastrarEmpresa(dadosEmpresa) {
  const resposta = await fetch(API_URL, {
    method: 'POST', // Define que a operação é de cadastro.
    headers: {
      'Content-Type': 'application/json', // Informa que enviamos JSON.
    },
    body: JSON.stringify(dadosEmpresa), // Converte o objeto em JSON.
  });

  // Informa se a API recusou o cadastro.
  if (!resposta.ok) {
    throw new Error('Não foi possível cadastrar a empresa.');
  }

  // Retorna os dados da empresa cadastrada.
  return await resposta.json();
}
