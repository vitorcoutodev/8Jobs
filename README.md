# 8Jobs

Uma plataforma web de vagas de emprego, na qual empresas possam cadastrar oportunidades e candidatos possam visualizar e se candidatar às vagas disponíveis.

---

# Objetivo

Desenvolver uma aplicação web funcional que permita:

- cadastrar empresas;
- cadastrar vagas de emprego;
- consultar vagas disponíveis;
- cadastrar candidatos;
- realizar candidaturas;
- consultar candidatos;
- relacionar candidatos e vagas;
- testar a API automaticamente;
- testar o frontend automaticamente;
- organizar o backend utilizando uma arquitetura orientada a microserviços.

---

# 1. Análise e planejamento

## 1.1 Problema

Empresas possuem dificuldades para divulgar suas oportunidades de trabalho e organizar os candidatos interessados.

O 8Jobs tem como objetivo centralizar a divulgação de vagas de emprego, permitindo que empresas cadastrem oportunidades e que candidatos consultem as vagas disponíveis e realizem suas candidaturas.

---

## 1.2 Funcionalidades

### Empresas

O sistema deverá permitir:

- cadastrar uma empresa;
- listar empresas;
- consultar uma empresa;
- alterar dados de uma empresa;
- excluir uma empresa.

### Vagas

O sistema deverá permitir:

- cadastrar uma vaga;
- listar vagas;
- consultar uma vaga;
- alterar uma vaga;
- excluir uma vaga;
- visualizar os dados da empresa responsável pela vaga.

### Candidatos

O sistema deverá permitir:

- cadastrar candidato;
- listar candidatos;
- consultar candidato;
- alterar dados;
- excluir candidato.

### Candidaturas

O sistema deverá permitir:

- realizar uma candidatura;
- consultar candidaturas;
- consultar uma candidatura;
- alterar uma candidatura;
- excluir uma candidatura;
- relacionar candidatos e vagas.

---

# 2. Entidades

## Empresa

```text
Empresa
├── id
├── nome
├── cnpj
├── email
├── telefone
└── cidade
```

## Vaga

```text
Vaga
├── id
├── titulo
├── descricao
├── salario
├── modalidade
├── cidade
├── requisitos
├── empresaId
└── status
```

### Status da vaga

```text
ABERTA
FECHADA
```

## Candidato

```text
Candidato
├── id
├── nome
├── email
├── telefone
├── cidade
└── habilidades
```

## Candidatura

```text
Candidatura
├── id
├── candidatoId
├── vagaId
├── data
└── status
```

### Status da candidatura

```text
ENVIADA
EM_ANALISE
APROVADA
REJEITADA
```

---

# 3. Arquitetura

O backend será desenvolvido utilizando uma arquitetura baseada em microserviços.

O sistema será dividido em serviços com responsabilidades independentes:

```text
                         ┌─────────────────┐
                         │     8Jobs       │
                         │    Frontend     │
                         └────────┬────────┘
                                  │
                               HTTP/REST
                                  │
          ┌───────────────────────┼───────────────────────┐
          │                       │                       │
          ▼                       ▼                       ▼
 ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
 │    Empresas     │    │      Vagas      │    │   Candidatos    │
 │   Microserviço  │    │   Microserviço  │    │   Microserviço  │
 └─────────────────┘    └─────────────────┘    └─────────────────┘
                                  │
                                  ▼
                         ┌─────────────────┐
                         │  Candidaturas   │
                         │   Microserviço  │
                         └────────┬────────┘
                                  │
                                  ▼
                           ┌─────────────┐
                           │   MongoDB   │
                           └─────────────┘
```

A comunicação entre o frontend e os serviços será realizada através de APIs REST e HTTP.

A imagem da arquitetura poderá ser armazenada em:

```text
docs/arquitetura.png
```

---

# 4. Meios utilizadas

## Frontend

- HTML5
- CSS3
- JavaScript
- Skeleton CSS

## Backend

- Node.js
- Express
- API REST
- JSON

## Banco de dados

- MongoDB

## Testes

- Jest → testes do backend/API
- Cypress → testes do frontend

## Arquitetura

- Microserviços
- Comunicação HTTP/REST entre serviços

---

# 5. API REST

## Empresas

```text
GET    /empresas
GET    /empresas/:id
POST   /empresas
PUT    /empresas/:id
DELETE /empresas/:id
```

## Vagas

```text
GET    /vagas
GET    /vagas/:id
POST   /vagas
PUT    /vagas/:id
DELETE /vagas/:id
```

## Candidatos

```text
GET    /candidatos
GET    /candidatos/:id
POST   /candidatos
PUT    /candidatos/:id
DELETE /candidatos/:id
```

## Candidaturas

```text
GET    /candidaturas
GET    /candidaturas/:id
POST   /candidaturas
PUT    /candidaturas/:id
DELETE /candidaturas/:id
```

---

# 6. MongoDB

Os dados serão armazenados no MongoDB.

##


# Histórias de Usuário

As histórias de usuário foram definidas de acordo com o cronograma de desenvolvimento do projeto, sendo uma história para cada dia de trabalho.

---

## US01 — Análise e planejamento

**Como equipe, queremos analisar o problema, definir as funcionalidades, entidades, arquitetura e responsabilidades do projeto, para organizar o desenvolvimento do 8Jobs.**

**Dia:** 1

**Entrega:**
- Documento inicial;
- Funcionalidades definidas;
- Entidades definidas;
- Histórias de usuário;
- Arquitetura;
- Divisão das tarefas da equipe.

---

## US02 — Banco e estrutura do projeto

**Como equipe de desenvolvimento, queremos configurar o MongoDB, a estrutura dos projetos, o Node.js, o Express e o Git/GitHub, para preparar o ambiente necessário para o desenvolvimento do 8Jobs.**

**Dia:** 2

**Entrega:**
- Banco MongoDB configurado;
- Collections definidas;
- Estrutura dos projetos criada;
- Node.js e Express configurados;
- Git/GitHub configurados.

---

## US03 — Microserviço de empresas

**Como empresa, quero cadastrar, consultar, alterar e excluir meus dados, para manter minhas informações disponíveis e atualizadas na plataforma.**

**Dia:** 3

**Funcionalidades:**
- Listar empresas;
- Consultar empresa por ID;
- Cadastrar empresa;
- Alterar empresa;
- Excluir empresa.

**Rotas:**

```text
GET    /empresas
GET    /empresas/:id
POST   /empresas
PUT    /empresas/:id
DELETE /empresas/:id
```

---

## US04 — Microserviço de vagas

**Como empresa, quero cadastrar, consultar, alterar e excluir vagas de emprego, para divulgar e manter atualizadas as oportunidades disponíveis na plataforma.**

**Dia:** 4

**Funcionalidades:**
- Listar vagas;
- Consultar vaga por ID;
- Cadastrar vaga;
- Alterar vaga;
- Excluir vaga.

**Rotas:**

```text
GET    /vagas
GET    /vagas/:id
POST   /vagas
PUT    /vagas/:id
DELETE /vagas/:id
```

---

## US05 — Candidatos e candidaturas

**Como candidato, quero cadastrar meus dados e realizar candidaturas às vagas disponíveis, para participar dos processos seletivos.**

**Dia:** 5

**Funcionalidades:**
- Cadastrar candidato;
- Listar candidatos;
- Consultar candidato;
- Alterar candidato;
- Excluir candidato;
- Realizar candidatura;
- Consultar candidaturas;
- Integrar candidatos, vagas e candidaturas.

**Rotas principais:**

```text
GET    /candidatos
GET    /candidatos/:id
POST   /candidatos
PUT    /candidatos/:id
DELETE /candidatos/:id

GET    /candidaturas
GET    /candidaturas/:id
POST   /candidaturas
PUT    /candidaturas/:id
DELETE /candidaturas/:id
```

---

## US06 — Desenvolvimento do frontend

**Como usuário, quero acessar uma interface web para visualizar vagas e realizar os cadastros necessários, para utilizar o 8Jobs de forma simples e organizada.**

**Dia:** 6

**Páginas:**
- Home;
- Lista de vagas;
- Detalhes da vaga;
- Cadastro de empresa;
- Cadastro de vaga;
- Cadastro de candidato;
- Lista de candidatos;
- Formulário de candidatura.

**Tecnologias:**
- HTML;
- CSS;
- Skeleton CSS;
- JavaScript.

---

## US07 — Integração do sistema

**Como usuário, quero que o frontend se comunique com a API e os microserviços, para que minhas ações sejam processadas e armazenadas no MongoDB.**

**Dia:** 7

**Fluxo:**

```text
Frontend
    ↓
JavaScript / Fetch
    ↓
API
    ↓
Microserviços
    ↓
MongoDB
```

**Objetivo principal:**
- Conectar frontend e backend;
- Integrar os microserviços;
- Integrar o MongoDB;
- Implementar o fluxo completo de candidatura.

---

## US08 — Testes automatizados com Jest

**Como desenvolvedor, quero criar testes automatizados para os serviços do sistema, para verificar se a API funciona corretamente e identificar possíveis erros.**

**Dia:** 8

**Testar:**
- Empresas;
- Vagas;
- Candidatos;
- Candidaturas;
- Situações de erro.

**Tecnologia:**

```text
Jest
```

---

## US09 — Testes do sistema com Cypress

**Como desenvolvedor, quero realizar testes de ponta a ponta simulando as ações de um usuário, para verificar o funcionamento do sistema desde o frontend até o banco de dados e corrigir problemas encontrados.**

**Dia:** 9

**Fluxo:**

```text
Usuário
   ↓
Frontend
   ↓
API
   ↓
Banco
```

**Testar principalmente:**
- Navegação;
- Consulta de vagas;
- Seleção de vaga;
- Formulário de candidatura;
- Envio da candidatura;
- Mensagens de sucesso;
- Situações inválidas.

**Tecnologia:**

```text
Cypress
```

---

## US10 — Finalização e apresentação

**Como equipe, queremos finalizar, revisar e apresentar o projeto, para demonstrar o funcionamento do 8Jobs, sua arquitetura, API, banco de dados, testes e decisões tomadas durante o desenvolvimento.**

**Dia:** 10

**Apresentar:**
1. Arquitetura;
2. Sistema;
3. API;
4. MongoDB;
5. Testes Jest;
6. Testes Cypress;
7. Microserviços;
8. Dificuldades e soluções.
