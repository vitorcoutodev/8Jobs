import { novoCandidato } from '../support/dados';
import {
  criarStore,
  instalarApiSimulada,
  novaEmpresa,
  novaVaga,
  novoCandidatoNoBanco,
} from '../support/fakeApi';

const enviar = () => cy.contains('button', 'Enviar candidatura').click();

// Espera o seletor de vagas terminar de carregar.
const aguardarVagas = () => cy.get('select[name="vagaId"]').should('not.be.disabled');

// Abre o formulário com a vaga já escolhida.
const abrirFormulario = (vaga) => {
  cy.visit(`/formulario?vagaId=${vaga._id}`);
  cy.get('select[name="vagaId"]').should('have.value', vaga._id);
};

const preencher = (dados) => {
  ['nome', 'email', 'telefone', 'cidade', 'habilidades'].forEach((campo) => {
    if (dados[campo]) cy.get(`input[name="${campo}"]`).clear().type(dados[campo]);
  });
};

describe('Candidatura', () => {
  let store; // "banco" simulado
  let empresa;
  let vaga;

  beforeEach(() => {
    store = criarStore();
    instalarApiSimulada(store);
    cy.intercept('POST', '**/api/candidatos').as('postCandidato');

    empresa = novaEmpresa(store);
    vaga = novaVaga(store, empresa, { modalidade: 'Remoto', cidade: 'Porto Alegre' });
  });

  // ---------------------------------------------------------------------------
  describe('fluxo completo (usuário → frontend → API)', () => {
    it('navega da listagem até a confirmação e grava candidato e candidatura', () => {
      const candidato = novoCandidato();
      cy.intercept('POST', '**/api/candidaturas').as('postCandidatura');

      // 1. Navegação e seleção da vaga
      cy.visit('/vagas');
      cy.contains('article', vaga.titulo).within(() => {
        cy.contains('a', 'Ver detalhes').click();
      });
      cy.location('pathname').should('eq', `/vagas/${vaga._id}`);
      cy.contains('a', 'Candidatar-se à vaga').click();

      // 2. Formulário com a vaga já escolhida
      cy.location('pathname').should('eq', '/formulario');
      cy.get('select[name="vagaId"]').should('have.value', vaga._id);

      // 3. Preenchimento e envio
      preencher(candidato);
      enviar();

      // 4. Chamadas à API
      cy.wait('@postCandidato').its('response.statusCode').should('eq', 201);
      cy.wait('@postCandidatura').then(({ request, response }) => {
        expect(response.statusCode).to.eq(201);
        expect(request.body.vagaId).to.eq(vaga._id);
        expect(response.body.status).to.eq('ENVIADA');
      });

      // 5. Mensagem de sucesso
      cy.contains('h1', 'Candidatura enviada').should('be.visible');
      cy.contains('[role="status"]', vaga.titulo);
      cy.contains('[role="status"]', `na ${empresa.nome}`);
      cy.contains('[role="status"]', 'O status inicial é Enviada');

      // 6. Conferência dos dados gravados
      cy.then(() => {
        expect(store.candidatos).to.have.length(1);
        const salvo = store.candidatos[0];
        expect(salvo.nome).to.eq(candidato.nome);
        expect(salvo.email).to.eq(candidato.email);
        expect(salvo.telefone).to.eq(candidato.telefone);
        expect(salvo.cidade).to.eq(candidato.cidade);
        expect(salvo.habilidades).to.deep.eq(['React', 'Node.js']);

        expect(store.candidaturas).to.have.length(1);
        expect(store.candidaturas[0].candidatoId).to.eq(salvo._id);
        expect(store.candidaturas[0].vagaId).to.eq(vaga._id);
        expect(store.candidaturas[0].status).to.eq('ENVIADA');
      });
    });

    it('seleciona a vaga pelo seletor quando abre o formulário direto', () => {
      cy.visit('/formulario');
      aguardarVagas();
      cy.get('select[name="vagaId"]').should('have.value', '');

      // O texto da opção mostra título, empresa, cidade e modalidade.
      cy.get(`select[name="vagaId"] option[value="${vaga._id}"]`)
        .should('contain', vaga.titulo)
        .and('contain', empresa.nome)
        .and('contain', 'Porto Alegre')
        .and('contain', 'Remoto');

      preencher(novoCandidato());
      cy.get('select[name="vagaId"]').select(vaga._id);
      enviar();

      cy.contains('h1', 'Candidatura enviada').should('be.visible');
      cy.then(() => expect(store.candidaturas[0].vagaId).to.eq(vaga._id));
    });

    it('habilidades são opcionais e ficam como lista vazia', () => {
      abrirFormulario(vaga);
      preencher(novoCandidato({ habilidades: '' }));
      enviar();

      cy.contains('h1', 'Candidatura enviada').should('be.visible');
      cy.then(() => expect(store.candidatos[0].habilidades).to.deep.eq([]));
    });

    it('mostra "Enviando..." e bloqueia o botão durante o envio', () => {
      store.atrasoMs = 1000;

      abrirFormulario(vaga);
      preencher(novoCandidato());
      enviar();

      cy.contains('button', 'Enviando...').should('be.disabled');
      cy.contains('h1', 'Candidatura enviada', { timeout: 10000 }).should('be.visible');
    });

    it('"Enviar outra candidatura" volta ao formulário vazio', () => {
      abrirFormulario(vaga);
      preencher(novoCandidato());
      enviar();
      cy.contains('h1', 'Candidatura enviada').should('be.visible');

      cy.contains('button', 'Enviar outra candidatura').click();

      cy.contains('h1', 'Candidate-se a uma vaga').should('be.visible');
      cy.get('input[name="nome"]').should('have.value', '');
      cy.get('input[name="email"]').should('have.value', '');
      cy.get('select[name="vagaId"]').should('have.value', '');
    });

    it('"Ver mais vagas" na confirmação leva à listagem de vagas', () => {
      abrirFormulario(vaga);
      preencher(novoCandidato());
      enviar();
      cy.contains('h1', 'Candidatura enviada').should('be.visible');

      cy.contains('a', 'Ver mais vagas').click();
      cy.location('pathname').should('eq', '/vagas');
    });

    it('"Voltar para as vagas" no topo do formulário leva à listagem', () => {
      cy.visit('/formulario');
      cy.contains('a', 'Voltar para as vagas').click();
      cy.location('pathname').should('eq', '/vagas');
    });
  });

  // ---------------------------------------------------------------------------
  describe('validação do formulário (situações inválidas)', () => {
    it('não envia nada quando o formulário está vazio', () => {
      cy.visit('/formulario');
      aguardarVagas();

      enviar();

      cy.get('@postCandidato.all').should('have.length', 0);
      cy.get('select[name="vagaId"]:invalid').should('exist');
      cy.get('input[name="nome"]:invalid').should('exist');
      cy.contains('h1', 'Candidatura enviada').should('not.exist');
    });

    ['nome', 'email', 'telefone', 'cidade'].forEach((campo) => {
      it(`não envia sem o campo obrigatório "${campo}"`, () => {
        abrirFormulario(vaga);
        preencher(novoCandidato({ [campo]: '' }));

        enviar();

        cy.get('@postCandidato.all').should('have.length', 0);
        cy.get(`input[name="${campo}"]:invalid`).should('exist');
      });
    });

    it('não envia sem escolher uma vaga', () => {
      cy.visit('/formulario');
      aguardarVagas();
      preencher(novoCandidato());

      enviar();

      cy.get('@postCandidato.all').should('have.length', 0);
      cy.get('select[name="vagaId"]:invalid').should('exist');
    });

    it('o navegador bloqueia e-mail sem "@"', () => {
      abrirFormulario(vaga);
      preencher(novoCandidato({ email: 'maria-sem-arroba' }));

      enviar();

      cy.get('@postCandidato.all').should('have.length', 0);
      cy.get('input[name="email"]:invalid').should('exist');
    });

    it('a API rejeita e-mail sem domínio completo ("maria@teste") e nada é gravado', () => {
      abrirFormulario(vaga);
      preencher(novoCandidato({ email: 'maria@teste' }));

      enviar();

      cy.wait('@postCandidato').its('response.statusCode').should('eq', 400);
      cy.get('[role="alert"]').should('contain', 'E-mail inválido');
      cy.contains('h1', 'Candidatura enviada').should('not.exist');
      cy.then(() => {
        expect(store.candidatos).to.have.length(0);
        expect(store.candidaturas).to.have.length(0);
      });
    });
  });

  // ---------------------------------------------------------------------------
  describe('regras de negócio (situações inválidas)', () => {
    it('e-mail já cadastrado mostra erro e não cria candidatura', () => {
      const existente = novoCandidatoNoBanco(store);

      abrirFormulario(vaga);
      preencher(novoCandidato({ email: existente.email }));
      enviar();

      cy.wait('@postCandidato').its('response.statusCode').should('eq', 409);
      cy.get('[role="alert"]').should('contain', 'Já existe um candidato com este email');
      cy.contains('h1', 'Candidatura enviada').should('not.exist');
      cy.then(() => expect(store.candidaturas).to.have.length(0));
    });

    it('vaga fechada depois de abrir o formulário: API recusa a candidatura', () => {
      abrirFormulario(vaga);

      // A empresa fecha a vaga enquanto o formulário está aberto.
      cy.then(() => {
        vaga.status = 'FECHADA';
      });

      preencher(novoCandidato());
      enviar();

      cy.get('[role="alert"]').should('contain', 'Esta vaga não está aberta para candidaturas');
      cy.contains('h1', 'Candidatura enviada').should('not.exist');
      cy.then(() => expect(store.candidaturas).to.have.length(0));
    });

    it('vaga fechada não aparece no seletor do formulário', () => {
      const fechada = novaVaga(store, empresa, { status: 'FECHADA' });

      cy.visit('/formulario');
      aguardarVagas();

      cy.get('select[name="vagaId"]').should('contain.text', vaga.titulo);
      cy.get('select[name="vagaId"]').should('not.contain.text', fechada.titulo);
    });

    it('sem vagas abertas o formulário fica desabilitado', () => {
      store.vagas.length = 0;

      cy.visit('/formulario');

      cy.get('select[name="vagaId"]').should('be.disabled');
      cy.contains('option', 'Nenhuma vaga aberta no momento').should('exist');
      cy.contains('button', 'Enviar candidatura').should('be.disabled');
    });

    it('mostra erro quando não consegue carregar as vagas', () => {
      cy.intercept('GET', '**/api/vagas', { forceNetworkError: true });

      cy.visit('/formulario');
      cy.contains('Não foi possível carregar as vagas.').should('be.visible');
    });
  });

  // ---------------------------------------------------------------------------
  describe('falhas de infraestrutura', () => {
    it('API fora do ar ao enviar: mostra erro de conexão e nada é gravado', () => {
      cy.intercept('POST', '**/api/candidatos', { forceNetworkError: true });

      abrirFormulario(vaga);
      preencher(novoCandidato());
      enviar();

      cy.get('[role="alert"]').should('contain', 'Não foi possível conectar à API');
      cy.contains('h1', 'Candidatura enviada').should('not.exist');
      cy.contains('button', 'Enviar candidatura').should('not.be.disabled');
      cy.then(() => expect(store.candidatos).to.have.length(0));
    });

    it('erro 500 ao criar a candidatura: tentar de novo reaproveita o candidato já criado', () => {
      let chamadas = 0;

      // Falha só na 1ª chamada; nas seguintes, a API simulada responde normalmente.
      cy.intercept('POST', '**/api/candidaturas', (req) => {
        chamadas += 1;
        if (chamadas === 1) {
          req.reply({ statusCode: 500, body: { erro: 'Erro ao cadastrar candidatura' } });
        }
      }).as('postCandidatura');

      abrirFormulario(vaga);
      preencher(novoCandidato());

      // 1ª tentativa: falha
      enviar();
      cy.wait('@postCandidatura');
      cy.get('[role="alert"]').should('contain', 'Erro ao cadastrar candidatura');

      // 2ª tentativa: funciona, sem cadastrar o mesmo e-mail de novo
      enviar();
      cy.wait('@postCandidatura').its('response.statusCode').should('eq', 201);
      cy.contains('h1', 'Candidatura enviada').should('be.visible');

      cy.get('@postCandidato.all').should('have.length', 1);
      cy.then(() => {
        expect(store.candidatos).to.have.length(1);
        expect(store.candidaturas).to.have.length(1);
      });
    });
  });
});
