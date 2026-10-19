import { criarStore, instalarApiSimulada, novaEmpresa, novaVaga } from '../support/fakeApi';

describe('Consulta de vagas', () => {
  let store;
  let empresa;
  let vaga;

  beforeEach(() => {
    store = criarStore();
    instalarApiSimulada(store);
    empresa = novaEmpresa(store);
    vaga = novaVaga(store, empresa, { salario: 4500, modalidade: 'Híbrido' });
  });

  describe('listagem (/vagas)', () => {
    it('mostra a vaga com os dados da empresa', () => {
      cy.visit('/vagas');

      cy.contains('h1', 'Vagas disponíveis').should('be.visible');
      cy.contains(/\d+ vagas? encontradas?/).should('be.visible');

      cy.contains('article', vaga.titulo).within(() => {
        cy.contains(empresa.nome);
        cy.contains(vaga.cidade);
        cy.contains('Híbrido');
        cy.contains('4500');
        cy.contains('a', 'Ver detalhes').should('have.attr', 'href', `/vagas/${vaga._id}`);
      });
    });

    it('conta as vagas encontradas', () => {
      novaVaga(store, empresa);

      cy.visit('/vagas');
      cy.contains('2 vagas encontradas').should('be.visible');
      cy.get('article').should('have.length', 2);
    });

    it('mostra "Carregando vagas..." enquanto a API responde', () => {
      store.atrasoMs = 800;

      cy.visit('/vagas');
      cy.contains('Carregando vagas...').should('be.visible');
      cy.contains('article', vaga.titulo).should('exist');
    });

    it('mostra o estado vazio quando não há vagas', () => {
      store.vagas.length = 0;

      cy.visit('/vagas');
      cy.contains('Nenhuma vaga cadastrada.').should('be.visible');
    });

    it('mostra mensagem de erro quando a API devolve erro 500', () => {
      cy.intercept('GET', '**/api/vagas', {
        statusCode: 500,
        body: { erro: 'Erro ao listar vagas' },
      });

      cy.visit('/vagas');
      cy.contains('Não foi possível carregar as vagas.').should('be.visible');
      cy.contains('Erro ao listar vagas').should('be.visible');
    });

    it('mostra mensagem de erro quando a API está fora do ar', () => {
      cy.intercept('GET', '**/api/vagas', { forceNetworkError: true });

      cy.visit('/vagas');
      cy.contains('Não foi possível carregar as vagas.').should('be.visible');
      cy.contains('Não foi possível conectar à API').should('be.visible');
    });
  });

  describe('busca na página inicial', () => {
    const campoBusca = 'input[placeholder^="Ex.: desenvolvedor"]';
    const campoLocal = 'input[placeholder="Cidade, estado ou remoto"]';

    it('lista a vaga cadastrada na home', () => {
      cy.visit('/');
      cy.contains('article', vaga.titulo).should('exist');
    });

    it('filtra por cargo', () => {
      const outra = novaVaga(store, empresa);

      cy.visit('/');
      cy.contains('article', outra.titulo).should('exist');

      cy.get(campoBusca).type(vaga.titulo);
      cy.get('article').should('have.length', 1).and('contain', vaga.titulo);
    });

    it('filtra por empresa', () => {
      const outraEmpresa = novaEmpresa(store);
      const vagaOutra = novaVaga(store, outraEmpresa);

      cy.visit('/');
      cy.contains('article', vagaOutra.titulo).should('exist');

      cy.get(campoBusca).type(empresa.nome);
      cy.contains('article', vaga.titulo).should('exist');
      cy.contains('article', vagaOutra.titulo).should('not.exist');
    });

    it('filtra por localização', () => {
      const vagaA = novaVaga(store, empresa, { cidade: 'Cidade Alfa' });
      const vagaB = novaVaga(store, empresa, { cidade: 'Cidade Beta' });

      cy.visit('/');
      cy.contains('article', vagaA.titulo).should('exist');
      cy.contains('article', vagaB.titulo).should('exist');

      cy.get(campoLocal).type('Cidade Alfa');
      cy.contains('article', vagaA.titulo).should('exist');
      cy.contains('article', vagaB.titulo).should('not.exist');
    });

    it('avisa quando nenhum resultado corresponde ao filtro', () => {
      cy.visit('/');
      cy.contains('article', vaga.titulo).should('exist');

      cy.get(campoBusca).type('zzz-nenhuma-vaga-com-este-nome-zzz');
      cy.get('article').should('not.exist');
      cy.contains('Não encontramos vagas com esses filtros.').should('be.visible');
    });

    it('o botão "Buscar vagas" não recarrega a página nem perde a lista', () => {
      cy.visit('/');
      cy.contains('article', vaga.titulo).should('exist');

      cy.get(campoBusca).type(vaga.titulo);
      cy.contains('button', 'Buscar vagas').click();

      cy.location('pathname').should('eq', '/');
      cy.contains('article', vaga.titulo).should('exist');
    });

    it('mostra o estado vazio da home quando não há vagas', () => {
      store.vagas.length = 0;

      cy.visit('/');
      cy.contains('Nenhuma vaga cadastrada ainda.').should('be.visible');
    });

    it('mostra o erro na home quando a API está fora do ar', () => {
      cy.intercept('GET', '**/api/vagas', { forceNetworkError: true });

      cy.visit('/');
      cy.contains('Não foi possível carregar as vagas.').should('be.visible');
      cy.contains('Não foi possível conectar à API').should('be.visible');
    });
  });
});
