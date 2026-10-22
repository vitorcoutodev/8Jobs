// Reúne os fluxos de cadastro, login empresarial e publicação de vaga.
import { criarStore, instalarApiSimulada, novaEmpresa, novoCandidatoNoBanco } from '../support/fakeApi';
import { novoCandidato, unico } from '../support/dados';

// Confirma que as contas e vagas podem ser criadas a partir das páginas web.
describe('Cadastro de contas e vagas', () => {
  let store;

  // Instala a API simulada para que cada teste use seu próprio banco em memória.
  beforeEach(() => {
    store = criarStore();
    instalarApiSimulada(store);
  });

  // Cadastra um candidato e confere a sessão iniciada após o registro.
  it('cadastra candidato com senha e inicia uma sessão', () => {
    const dados = novoCandidato();
    cy.visit('/cadastro-candidato');
    cy.get('[name="nome"]').type(dados.nome);
    cy.get('[name="cpf"]').type(dados.cpf);
    cy.get('[name="email"]').type(dados.email);
    cy.get('[name="senha"]').type(dados.senha);
    cy.get('[name="telefone"]').type(dados.telefone);
    cy.get('[name="cidade"]').type(dados.cidade);
    cy.get('[name="habilidades"]').type(dados.habilidades);
    cy.contains('button', 'Cadastrar candidato').click();
    cy.contains('Candidato cadastrado com sucesso').should('be.visible');
    cy.then(() => {
      expect(store.candidatos).to.have.length(1);
      expect(store.candidatos[0]).not.to.have.property('senha');
      expect(store.usuario.role).to.equal('candidato');
    });
  });

  // Cadastra uma empresa e confirma que ela entra com seu próprio papel.
  it('cadastra empresa com senha e inicia uma sessão empresarial', () => {
    const sufixo = unico();
    cy.visit('/cadastro-empresa');
    cy.get('[name="nome"]').type('Empresa Cypress');
    cy.get('[name="cnpj"]').type(`${Date.now()}`);
    cy.get('[name="email"]').type(`empresa.${sufixo}@teste.com`);
    cy.get('[name="senha"]').type('SenhaEmpresa2026!');
    cy.get('[name="telefone"]').type('(51) 99999-1111');
    cy.get('[name="cidade"]').type('Porto Alegre');
    cy.contains('button', 'Cadastrar empresa').click();
    cy.contains('Empresa cadastrada com sucesso').should('be.visible');
    cy.then(() => {
      expect(store.empresas).to.have.length(1);
      expect(store.usuario.role).to.equal('empresa');
    });
  });

  // Cria uma empresa pela interface, entra e publica uma vaga associada a ela.
  it('permite que a empresa autenticada cadastre uma vaga', () => {
    const sufixo = unico();
    cy.visit('/cadastro-empresa');
    cy.get('[name="nome"]').type('Empresa Publicadora');
    cy.get('[name="cnpj"]').type(`${Date.now()}`);
    cy.get('[name="email"]').type(`publicadora.${sufixo}@teste.com`);
    cy.get('[name="senha"]').type('SenhaEmpresa2026!');
    cy.get('[name="telefone"]').type('(51) 99999-2222');
    cy.get('[name="cidade"]').type('São Leopoldo');
    cy.contains('button', 'Cadastrar empresa').click();
    cy.contains('Empresa cadastrada com sucesso').should('be.visible');
    cy.get('nav[aria-label="Navegação principal"]').contains('Publicar vaga').click();
    cy.get('[name="titulo"]').type('Analista Cypress');
    cy.get('[name="descricao"]').type('Vaga criada pelo teste Cypress.');
    cy.get('[name="requisitos"]').type('Conhecimento em testes');
    cy.get('[name="cidade"]').type('São Leopoldo');
    cy.get('[name="modalidade"]').select('Remoto');
    cy.get('[name="salario"]').type('5000');
    cy.get('[name="status"]').select('ABERTA');
    cy.contains('button', 'Cadastrar vaga').click();
    cy.contains('Vaga cadastrada com sucesso').should('be.visible');
    cy.then(() => {
      expect(store.vagas).to.have.length(1);
      expect(store.vagas[0].empresaId).to.equal(store.usuario.id);
    });
  });

  // Testa o login de uma conta já registrada sem depender do formulário de cadastro.
  it('permite entrar com uma conta candidata já existente', () => {
    const candidato = novoCandidatoNoBanco(store);
    cy.visit('/login');
    cy.get('[aria-label="Tipo de conta"]').select('candidato');
    cy.get('[aria-label="E-mail"]').type(candidato.email);
    cy.get('[aria-label="Senha"]').type('SenhaTeste2026!');
    cy.contains('button', 'Entrar').click();
    cy.then(() => expect(store.usuario.id).to.equal(candidato._id));
  });

  // Confirma que empresas também autenticam e recebem o papel correto.
  it('permite entrar com uma conta empresarial já existente', () => {
    const empresa = novaEmpresa(store);
    store.credenciais.push({ email: empresa.email, senha: 'SenhaEmpresa2026!', role: 'empresa', id: empresa._id, nome: empresa.nome });
    cy.visit('/login');
    cy.get('[aria-label="Tipo de conta"]').select('empresa');
    cy.get('[aria-label="E-mail"]').type(empresa.email);
    cy.get('[aria-label="Senha"]').type('SenhaEmpresa2026!');
    cy.contains('button', 'Entrar').click();
    cy.then(() => expect(store.usuario.role).to.equal('empresa'));
  });

  // Mostra uma mensagem de erro quando a senha não confere.
  it('recusa senha inválida sem criar sessão', () => {
    const candidato = novoCandidatoNoBanco(store);
    cy.visit('/login');
    cy.get('[aria-label="Tipo de conta"]').select('candidato');
    cy.get('[aria-label="E-mail"]').type(candidato.email);
    cy.get('[aria-label="Senha"]').type('SenhaErrada2026!');
    cy.contains('button', 'Entrar').click();
    cy.get('[role="alert"]').should('contain', 'E-mail ou senha incorretos');
    cy.then(() => expect(store.usuario).to.equal(null));
  });

  // Encerra a sessão pelo menu e remove as ações disponíveis para contas conectadas.
  it('encerra a sessão ao selecionar Sair', () => {
    const candidato = novoCandidatoNoBanco(store);
    cy.visit('/login');
    cy.get('[aria-label="Tipo de conta"]').select('candidato');
    cy.get('[aria-label="E-mail"]').type(candidato.email);
    cy.get('[aria-label="Senha"]').type('SenhaTeste2026!');
    cy.contains('button', 'Entrar').click();
    cy.contains('button', 'Sair').click();
    cy.contains('a', 'Entrar').should('be.visible');
    cy.then(() => expect(store.usuario).to.equal(null));
  });
});
