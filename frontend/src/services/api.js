const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3000/api').replace(/\/$/, '');

export async function requisitarApi(caminho, opcoes = {}) {
  let resposta;

  try {
    resposta = await fetch(`${API_BASE_URL}${caminho}`, {
      ...opcoes,
      headers: {
        ...(opcoes.body ? { 'Content-Type': 'application/json' } : {}),
        ...opcoes.headers,
      },
    });
  } catch {
    throw new Error('Não foi possível conectar à API. Verifique se o gateway está em execução.');
  }

  const tipo = resposta.headers.get('content-type') || '';
  const dados = tipo.includes('application/json')
    ? await resposta.json().catch(() => null)
    : await resposta.text();

  if (!resposta.ok) {
    throw new Error(dados?.erro || dados?.message || 'A solicitação não foi concluída.');
  }

  return dados;
}

export function enviarJson(caminho, metodo, dados) {
  return requisitarApi(caminho, {
    method: metodo,
    body: JSON.stringify(dados),
  });
}
