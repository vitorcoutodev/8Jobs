import { criarStore, instalarApiSimulada, novaEmpresa, novaVaga } from '../support/fakeApi';

describe('Seleção de vaga (detalhes)', () => {
  let store;
  let empresa;
  let vaga;

  beforeEach(() => {
    store = criarStore();
    instalarApiSimulada(store);
    empresa = novaEmpresa(store);
    vaga = novaVaga(store, empresa, {
      salario: 5200,
      modalidade: 'Remoto',
      requisitos: 'Experiência com Cypress',
    });
  });

  it('abre os detalhes a partir do botão "Ver detalhes" da listagem', () => {
    cy.visit('/vagas');

    cy.contains('article', vaga.titulo).within(() => {
      cy.contains('a', 'Ver detalhes').click();
    });

    cy.location('pathname').should('eq', `/vagas/${vaga._id}`);
    cy.contains('h1', vaga.titulo).should('be.visible');
    cy.contains(empresa.nome).should('be.visible');
    cy.contains(vaga.cidade).should('be.visible');
    cy.contains('Remoto').should('be.visible');
    cy.contains('ABERTA').should('be.visible');
    cy.contains('5200').should('be.visible');
    cy.contains(vaga.descricao).should('be.visible');
    cy.contains('Experiência com Cypress').should('be.visible');
  });

  it('abre os detalhes clicando no título do cartão', () => {
    cy.visit('/vagas');
    cy.contains('article', vaga.titulo).find('a').first().click();
    cy.location('pathname').should('eq', `/vagas/${vaga._id}`);
    cy.contains('h1', vaga.titulo).should('be.visible');
  });

  it('abre os detalhes a partir da página inicial', () => {
    cy.visit('/');
    cy.contains('article', vaga.titulo).within(() => {
      cy.contains('a', 'Ver detalhes').click();
    });
    cy.location('pathname').should('eq', `/vagas/${vaga._id}`);
  });

  it('"Voltar para as vagas" retorna à listagem', () => {
    cy.visit(`/vagas/${vaga._id}`);
    cy.contains('h1', vaga.titulo).should('be.visible');

    cy.contains('a', 'Voltar para as vagas').click();
    cy.location('pathname').should('eq', '/vagas');
  });

  it('o botão voltar do navegador retorna à listagem', () => {
    cy.visit('/vagas');
    cy.contains('article', vaga.titulo).within(() => {
      cy.contains('a', 'Ver detalhes').click();
    });
    cy.location('pathname').should('eq', `/vagas/${vaga._id}`);

    cy.go('back');
    cy.location('pathname').should('eq', '/vagas');
  });

  it('"Candidatar-se à vaga" abre o formulário com a vaga já selecionada', () => {
    cy.visit(`/vagas/${vaga._id}`);

    cy.contains('a', 'Candidatar-se à vaga').click();

    cy.location('pathname').should('eq', '/formulario');
    cy.location('search').should('eq', `?vagaId=${vaga._id}`);
    cy.get('select[name="vagaId"]').should('have.value', vaga._id);
  });

  it('vaga FECHADA mostra o status FECHADA nos detalhes', () => {
    const fechada = novaVaga(store, empresa, { status: 'FECHADA' });

    cy.visit(`/vagas/${fechada._id}`);
    cy.contains('h1', fechada.titulo).should('be.visible');
    cy.contains('FECHADA').should('be.visible');
  });

  describe('situações inválidas', () => {
    it('vaga que não existe mostra "Vaga não encontrada"', () => {
      cy.visit('/vagas/000000000000000000000000');

      cy.contains('Não foi possível abrir a vaga').should('be.visible');
      cy.contains('Vaga não encontrada').should('be.visible');
    });

    it('ID mal formado mostra "ID inválido"', () => {
      cy.visit('/vagas/abc');

      cy.contains('Não foi possível abrir a vaga').should('be.visible');
      cy.contains('ID inválido').should('be.visible');
    });

    it('a partir do erro é possível voltar às vagas', () => {
      cy.visit('/vagas/000000000000000000000000');

      cy.contains('a', 'Ver todas as vagas').click();
      cy.location('pathname').should('eq', '/vagas');
      cy.contains('h1', 'Vagas disponíveis').should('be.visible');
    });

    it('API fora do ar nos detalhes mostra mensagem de conexão', () => {
      cy.intercept('GET', `**/api/vagas/${vaga._id}`, { forceNetworkError: true });

      cy.visit(`/vagas/${vaga._id}`);
      cy.contains('Não foi possível abrir a vaga').should('be.visible');
      cy.contains('Não foi possível conectar à API').should('be.visible');
    });
  });
});
