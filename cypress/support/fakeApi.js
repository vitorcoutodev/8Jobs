// API SIMULADA do 8Jobs.
// Substitui o gateway + microserviços + MongoDB durante os testes.
// Reproduz as regras e as mensagens de erro reais dos serviços, e guarda os dados
// em memória (o "banco" do teste), que os testes podem consultar.

const ID_VALIDO = /^[0-9a-f]{24}$/i;
const EMAIL_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

let sequencia = 0;
const novoId = () => `64f0a1b2c3d4e5f6${(++sequencia).toString(16).padStart(8, '0')}`;

const ok = (body, statusCode = 200) => ({ statusCode, body });
const erro = (statusCode, mensagem) => ({ statusCode, body: { erro: mensagem } });
const texto = (v) => (typeof v === 'string' ? v.trim() : '');

// --- "Banco" em memória ------------------------------------------------------

export function criarStore() {
  return { empresas: [], vagas: [], candidatos: [], candidaturas: [], atrasoMs: 0 };
}

export function novaEmpresa(store, extra = {}) {
  const empresa = {
    _id: novoId(),
    nome: `Empresa Teste ${String(sequencia).padStart(4, "0")}`,
    cnpj: String(10000000000000 + sequencia),
    email: `contato${sequencia}@empresa.com`,
    telefone: '(51) 3333-4444',
    cidade: 'São Leopoldo',
    ...extra,
  };
  store.empresas.push(empresa);
  return empresa;
}

export function novaVaga(store, empresa, extra = {}) {
  const vaga = {
    _id: novoId(),
    titulo: `Desenvolvedor Node ${String(sequencia).padStart(4, "0")}`,
    descricao: 'Descrição da vaga de teste.',
    requisitos: 'Conhecimento em Node.js e React',
    salario: 4500,
    modalidade: 'Remoto',
    cidade: 'Porto Alegre',
    empresaId: empresa._id,
    status: 'ABERTA',
    createdAt: new Date().toISOString(),
    ...extra,
  };
  store.vagas.push(vaga);
  return vaga;
}

export function novoCandidatoNoBanco(store, extra = {}) {
  const candidato = {
    _id: novoId(),
    nome: 'Candidato Existente',
    email: `existente${sequencia}@teste.com`,
    telefone: '(51) 98888-0000',
    cidade: 'Canoas',
    habilidades: [],
    createdAt: new Date().toISOString(),
    ...extra,
  };
  store.candidatos.push(candidato);
  return candidato;
}

// --- Regras da API (iguais às dos microserviços) ----------------------------

const comEmpresa = (store, vaga) => ({
  ...vaga,
  empresa: store.empresas.find((e) => e._id === vaga.empresaId) || null,
});

function criarCandidato(store, corpo) {
  const erros = [];
  const email = texto(corpo.email).toLowerCase();

  if (!texto(corpo.nome)) erros.push('O nome é obrigatório');
  if (!email) erros.push('O e-mail é obrigatório');
  else if (!EMAIL_VALIDO.test(email)) erros.push('E-mail inválido');
  if (!texto(corpo.telefone)) erros.push('O telefone é obrigatório');
  if (!texto(corpo.cidade)) erros.push('A cidade é obrigatória');
  if (erros.length) return erro(400, erros.join('; '));

  if (store.candidatos.some((c) => c.email === email)) {
    return erro(409, 'Já existe um candidato com este email');
  }

  const candidato = {
    _id: novoId(),
    nome: texto(corpo.nome),
    email,
    telefone: texto(corpo.telefone),
    cidade: texto(corpo.cidade),
    habilidades: Array.isArray(corpo.habilidades) ? corpo.habilidades : [],
    createdAt: new Date().toISOString(),
  };
  store.candidatos.push(candidato);
  return ok(candidato, 201);
}

function criarCandidatura(store, corpo) {
  const { candidatoId, vagaId } = corpo || {};

  if (!candidatoId || !vagaId) return erro(400, 'Informe o ID do candidato e o ID da vaga');
  if (!store.candidatos.some((c) => c._id === candidatoId)) return erro(400, 'Candidato não encontrado');

  const vaga = store.vagas.find((v) => v._id === vagaId);
  if (!vaga) return erro(400, 'Vaga não encontrada');
  if (vaga.status !== 'ABERTA') return erro(400, 'Esta vaga não está aberta para candidaturas');

  if (store.candidaturas.some((c) => c.candidatoId === candidatoId && c.vagaId === vagaId)) {
    return erro(409, 'Este candidato já se candidatou a esta vaga');
  }

  const candidatura = {
    _id: novoId(),
    candidatoId,
    vagaId,
    data: new Date().toISOString(),
    status: 'ENVIADA',
  };
  store.candidaturas.push(candidatura);
  return ok(candidatura, 201);
}

export function responder(store, metodo, caminho, corpo = {}) {
  const [, recurso, id] = caminho.split('/');

  if (recurso === 'vagas' && metodo === 'GET') {
    if (!id) return ok(store.vagas.map((v) => comEmpresa(store, v)));
    if (!ID_VALIDO.test(id)) return erro(400, 'ID inválido');
    const vaga = store.vagas.find((v) => v._id === id);
    return vaga ? ok(comEmpresa(store, vaga)) : erro(404, 'Vaga não encontrada');
  }

  if (recurso === 'empresas' && metodo === 'GET') {
    if (!id) return ok(store.empresas);
    const empresa = store.empresas.find((e) => e._id === id);
    return empresa ? ok(empresa) : erro(404, 'Empresa não encontrada');
  }

  if (recurso === 'candidatos') {
    if (metodo === 'GET' && !id) return ok(store.candidatos);
    if (metodo === 'GET') {
      const candidato = store.candidatos.find((c) => c._id === id);
      return candidato ? ok(candidato) : erro(404, 'Candidato não encontrado');
    }
    if (metodo === 'POST') return criarCandidato(store, corpo);
  }

  if (recurso === 'candidaturas') {
    if (metodo === 'GET' && !id) return ok(store.candidaturas);
    if (metodo === 'POST') return criarCandidatura(store, corpo);
  }

  return erro(404, `Rota não simulada: ${metodo} ${caminho}`);
}

// --- Liga a API simulada no Cypress -----------------------------------------

const CORS = {
  'access-control-allow-origin': '*',
  'access-control-allow-headers': 'content-type,authorization',
  'access-control-allow-methods': 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
};

export function instalarApiSimulada(store) {
  cy.intercept(
    { url: /\/api\/(empresas|vagas|candidatos|candidaturas)(\/[^/?#]*)?(\?.*)?$/ },
    (req) => {
      if (req.method === 'OPTIONS') {
        req.reply({ statusCode: 204, headers: CORS });
        return;
      }

      const caminho = new URL(req.url).pathname.replace(/^\/api/, '');
      const resposta = responder(store, req.method, caminho, req.body || {});

      req.reply({
        statusCode: resposta.statusCode,
        body: resposta.body,
        headers: CORS,
        delay: store.atrasoMs || 0,
      });
    }
  ).as('apiSimulada');
}
