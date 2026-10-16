// Endereço base da API do microserviço de vagas.
const API_URL = 'http://localhost:3002/vagas';

// Busca as vagas cadastradas no backend.
export async function listarVagas() {
  const resposta = await fetch(API_URL);

  // Interrompe a operação quando a API retorna um erro HTTP.
  if (!resposta.ok) {
    throw new Error('Não foi possível carregar as vagas.');
  }

  // Converte a resposta JSON para dados que o JavaScript pode utilizar.
  return await resposta.json();
}

// Envia uma nova vaga para o backend por meio de uma requisição POST.
export async function cadastrarVaga(dadosVaga) {
  const resposta = await fetch(API_URL, {
    // Informa que a operação é de criação de um novo registro.
    method: 'POST',

    // Informa à API que o corpo da requisição está no formato JSON.
    headers: {
      'Content-Type': 'application/json',
    },

    // Converte os dados do formulário para texto JSON.
    body: JSON.stringify(dadosVaga),
  });

  // Tenta obter a mensagem de erro enviada pelo backend.
  if (!resposta.ok) {
    let mensagem = 'Não foi possível cadastrar a vaga.';

    try {
      const erro = await resposta.json();
      mensagem = erro.message || erro.erro || mensagem;
    } catch {
      // Mantém a mensagem padrão se a resposta não for JSON.
    }

    throw new Error(mensagem);
  }

  // Algumas APIs respondem sem conteúdo após um cadastro bem-sucedido.
  if (resposta.status === 204) {
    return null;
  }

  // Retorna os dados criados, quando a API envia uma resposta JSON.
  const tipoConteudo = resposta.headers.get('content-type') || '';

  if (tipoConteudo.includes('application/json')) {
    return await resposta.json();
  }

  return null;
}
