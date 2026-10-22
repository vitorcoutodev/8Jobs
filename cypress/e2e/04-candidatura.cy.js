// Cria uma sessão e uma vaga de teste para cada fluxo de candidatura.
import { criarStore, instalarApiSimulada, novaEmpresa, novaVaga, novoCandidatoNoBanco } from '../support/fakeApi';

// Valida que as candidaturas usam a conta da sessão ativa.
describe('Candidatura com conta autenticada', () => {
  let store;
  let candidato;
  let vaga;

  // Prepara o estado independente usado por cada teste.
  beforeEach(() => {
    store = criarStore();
    instalarApiSimulada(store);
    const empresa = novaEmpresa(store);
    vaga = novaVaga(store, empresa);
    candidato = novoCandidatoNoBanco(store);
    store.usuario = { id: candidato._id, nome: candidato.nome, email: candidato.email, role: 'candidato' };
  });

  // Envia uma candidatura para a vaga selecionada.
  it('envia uma candidatura vinculada ao candidato autenticado', () => {
    cy.visit(`/formulario?vagaId=${vaga._id}`);
    cy.get('select[name="vagaId"]').should('have.value', vaga._id);
    cy.contains('button', 'Enviar candidatura').click();
    cy.contains('Candidatura enviada').should('be.visible');
    cy.then(() => {
      expect(store.candidaturas).to.have.length(1);
      expect(store.candidaturas[0].candidatoId).to.equal(candidato._id);
      expect(store.candidaturas[0].vagaId).to.equal(vaga._id);
    });
  });

  // Confirma que o formulário recusa candidaturas duplicadas.
  it('mostra erro quando a pessoa já se candidatou à mesma vaga', () => {
    cy.visit(`/formulario?vagaId=${vaga._id}`);
    cy.contains('button', 'Enviar candidatura').click();
    cy.visit(`/formulario?vagaId=${vaga._id}`);
    cy.contains('button', 'Enviar candidatura').click();
    cy.get('[role="alert"]').should('contain', 'já se candidatou');
  });

  // Mantém a validação de vagas abertas antes do envio.
  it('não mostra vaga fechada no seletor de candidatura', () => {
    const fechada = novaVaga(store, novaEmpresa(store), { status: 'FECHADA' });
    cy.visit('/formulario');
    cy.get('select[name="vagaId"]').should('contain.text', vaga.titulo);
    cy.get('select[name="vagaId"]').should('not.contain.text', fechada.titulo);
  });

  // Direciona pessoas sem sessão ao formulário de login.
  it('pede login quando a pessoa tenta abrir o formulário sem sessão', () => {
    store.usuario = null;
    cy.visit(`/formulario?vagaId=${vaga._id}`);
    cy.location('pathname').should('eq', '/login');
    cy.contains('h1', 'Entrar no 8Jobs').should('be.visible');
  });
});
