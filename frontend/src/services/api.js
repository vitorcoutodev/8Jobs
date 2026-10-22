// Usa o endereço configurado no ambiente ou, por padrão, o gateway local.
const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3000/api').replace(/\/$/, '');

// Faz pedidos à API, incluindo a sessão e tratando respostas e erros.
export async function requisitarApi(caminho, opcoes = {}) {
  let resposta;

  try {
    resposta = await fetch(`${API_BASE_URL}${caminho}`, {
      ...opcoes,
      credentials: 'include',
      headers: {
        ...(opcoes.body ? { 'Content-Type': 'application/json' } : {}),
        ...opcoes.headers,
      },
    });
  } catch {
    throw new Error('Não foi possível conectar à API. Verifique se o gateway está em execução.');
  }

  // Interpreta a resposta como JSON ou texto, conforme o conteúdo recebido.
  const tipo = resposta.headers.get('content-type') || '';
  const dados = tipo.includes('application/json')
    ? await resposta.json().catch(() => null)
    : await resposta.text();

  // Usa a mensagem da API quando o pedido falha; caso contrário, devolve os dados.
  if (!resposta.ok) {
    throw new Error(dados?.erro || dados?.message || 'A solicitação não foi concluída.');
  }

  return dados;
}

// Envia dados em JSON reutilizando a função geral de requisições.
export function enviarJson(caminho, metodo, dados) {
  return requisitarApi(caminho, {
    method: metodo,
    body: JSON.stringify(dados),
  });
}
