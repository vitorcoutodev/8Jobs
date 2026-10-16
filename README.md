p8Jobs
Uma plataforma web de vagas de emprego, na qual empresas possam cadastrar oportunidades e candidatos possam visualizar e se candidatar às vagas disponíveis.

Objetivo
Desenvolver uma aplicação web funcional que permita:

cadastrar empresas;
cadastrar vagas de emprego;
consultar vagas disponíveis;
cadastrar candidatos;
realizar candidaturas;
consultar candidatos;
relacionar candidatos e vagas;
testar a API automaticamente;
testar o frontend automaticamente;
organizar o backend utilizando uma arquitetura orientada a microserviços.
1. Análise e planejamento
1.1 Problema
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

1.2 Funcionalidades
Empresas
O sistema deverá permitir:

cadastrar uma empresa;
listar empresas;
consultar uma empresa;
alterar dados de uma empresa;
excluir uma empresa.
Vagas
O sistema deverá permitir:

cadastrar uma vaga;
listar vagas;
consultar uma vaga;
alterar uma vaga;
excluir uma vaga;
visualizar os dados da empresa responsável pela vaga.
Candidatos
O sistema deverá permitir:

cadastrar candidato;
listar candidatos;
consultar candidato;
alterar dados;
excluir candidato.
Candidaturas
O sistema deverá permitir:

realizar uma candidatura;
consultar candidaturas;
consultar uma candidatura;
alterar uma candidatura;
excluir uma candidatura;
relacionar candidatos e vagas.
2. Entidades
Empresa
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
Vaga
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
Status da vaga
ABERTA
FECHADA
Candidato
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
Candidatura
```

## Candidatura

```text
Candidatura
├── id
├── candidatoId
├── vagaId
├── data
└── status
Status da candidatura
```

### Status da candidatura

```text
ENVIADA
EM_ANALISE
APROVADA
REJEITADA
3. Arquitetura
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

docs/arquitetura.png
4. Meios utilizadas
Frontend
HTML5
CSS3
JavaScript
Skeleton CSS
Backend
Node.js
Express
API REST
JSON
Banco de dados
MongoDB
Testes
Jest → testes do backend/API
Cypress → testes do frontend
Arquitetura
Microserviços
Comunicação HTTP/REST entre serviços
5. API REST
Empresas
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
Vagas
```

## Vagas

```text
GET    /vagas
GET    /vagas/:id
POST   /vagas
PUT    /vagas/:id
DELETE /vagas/:id
Candidatos
```

## Candidatos

```text
GET    /candidatos
GET    /candidatos/:id
POST   /candidatos
PUT    /candidatos/:id
DELETE /candidatos/:id
Candidaturas
```

## Candidaturas

```text
GET    /candidaturas
GET    /candidaturas/:id
POST   /candidaturas
PUT    /candidaturas/:id
DELETE /candidaturas/:id

6. MongoDB
Os dados serão armazenados no MongoDB.

7. Gateway
Porta do server principal 3000:
Porta do server empresas 3001:
Porta do server vagas 3002:
Porta do server candidatos 3003:
Porta do serve candidaturas 3004:
POrta do server Mongo 20717:
```

---

# 6. MongoDB

Os dados serão armazenados no MongoDB.

##

# Execução do fluxo integrado (Dia 7)

O front-end envia as chamadas para o gateway em `http://localhost:3000/api`. O gateway encaminha cada recurso para o seu microserviço:

| Recurso público | Serviço | Porta padrão |
| --- | --- | ---: |
| `/api/empresas` | Empresas | 3001 |
| `/api/vagas` | Vagas | 3002 |
| `/api/candidatos` | Candidatos | 3003 |
| `/api/candidaturas` | Candidaturas | 3004 |

Cada microserviço grava seus documentos no MongoDB configurado por `MONGODB_URI`. Para desenvolvimento local, os arquivos `.env.example` apontam para `mongodb://localhost:27017/8jobs`.

1. Inicie o MongoDB localmente.
2. Copie `.env.example` para `.env` na raiz e copie o `.env.example` de cada pasta em `services/` para `.env` naquela mesma pasta.
3. Instale as dependências na raiz, no front-end e em cada serviço: `npm install` e `npm --prefix frontend install`, `npm --prefix services/empresas install`, `npm --prefix services/vagas install`, `npm --prefix services/candidatos install` e `npm --prefix services/candidaturas install`.
4. Em terminais separados, execute na raiz: `npm run start:gateway`, `npm run start:empresas`, `npm run start:vagas`, `npm run start:candidatos`, `npm run start:candidaturas` e `npm run dev:frontend`.

No fluxo de candidatura, o formulário cria ou reaproveita o candidato durante a tentativa, envia `candidatoId` e `vagaId` ao serviço de candidaturas, e esse serviço confirma que ambos existem e que a vaga está aberta antes de persistir o vínculo no MongoDB.
