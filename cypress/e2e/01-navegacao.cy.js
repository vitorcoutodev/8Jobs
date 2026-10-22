import { criarStore, instalarApiSimulada } from '../support/fakeApi';

describe('Navegação', () => {
  beforeEach(() => {
    instalarApiSimulada(criarStore());
  });

  it('abre a página inicial', () => {
    cy.visit('/');
    cy.title().should('contain', '8Jobs');
    cy.contains('h1', 'O trabalho certo muda').should('be.visible');
    cy.contains('h2', 'Vagas disponíveis').should('exist');
  });

  describe('menu principal', () => {
    beforeEach(() => {
      cy.visit('/');
    });

    it('"Vagas" leva à listagem de vagas', () => {
      cy.get('nav[aria-label="Navegação principal"]').contains('a', 'Vagas').click();
      cy.location('pathname').should('eq', '/vagas');
      cy.contains('h1', 'Vagas disponíveis').should('be.visible');
    });

    it('"Cadastrar empresa" leva ao cadastro de empresa', () => {
      cy.get('nav[aria-label="Navegação principal"]').contains('a', 'Cadastrar empresa').click();
      cy.location('pathname').should('eq', '/cadastro-empresa');
    });

    it('"Criar conta" leva ao cadastro de candidato', () => {
      cy.get('nav[aria-label="Navegação principal"]').contains('a', 'Criar conta').click();
      cy.location('pathname').should('eq', '/cadastro-candidato');
      cy.contains('h1', 'Crie seu cadastro').should('be.visible');
    });

    it('o logotipo volta para a página inicial', () => {
      cy.visit('/vagas');
      cy.get('nav[aria-label="Navegação principal"]').find('a[aria-label="8Jobs, início"]').click();
      cy.location('pathname').should('eq', '/');
      cy.contains('h1', 'O trabalho certo muda').should('be.visible');
    });

    it('"Ver todas as vagas" (home) leva à listagem', () => {
      cy.contains('a', 'Ver todas as vagas').click();
      cy.location('pathname').should('eq', '/vagas');
    });

    it('"Conheça o 8Jobs para empresas" leva ao cadastro de empresa', () => {
      cy.contains('a', 'Conheça o 8Jobs para empresas').click();
      cy.location('pathname').should('eq', '/cadastro-empresa');
    });
  });

  it('"Voltar ao início" (cadastro de candidato) volta para a home', () => {
    cy.visit('/cadastro-candidato');
    cy.contains('a', 'Voltar ao início').click();
    cy.location('pathname').should('eq', '/');
  });

  it('abre páginas públicas digitando a URL diretamente', () => {
    cy.visit('/vagas');
    cy.contains('h1', 'Vagas disponíveis').should('be.visible');

    cy.visit('/cadastro-candidato');
    cy.contains('h1', 'Crie seu cadastro').should('be.visible');
  });

  it('redireciona páginas protegidas para o login', () => {
    cy.visit('/formulario');
    cy.location('pathname').should('eq', '/login');
    cy.visit('/candidatos');
    cy.location('pathname').should('eq', '/login');
    cy.visit('/vagas/cadastrar');
    cy.location('pathname').should('eq', '/login');
  });
});
