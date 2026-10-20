# 8Jobs

Plataforma de vagas de emprego. Empresas cadastram oportunidades; candidatos
consultam as vagas e enviam candidaturas.

## Funcionalidades

- Cadastrar, consultar, atualizar e excluir empresas.
- Cadastrar, consultar, atualizar e excluir vagas.
- Cadastrar, consultar, atualizar e excluir candidatos.
- Criar e consultar candidaturas, alterar seu status e excluí-las.
- Consultar vagas pela interface React e enviar candidaturas pelo formulário.
- Testar os serviços com Jest e os fluxos de interface com Cypress.

## Tecnologias

- Frontend: React, Vite, React Router e Tailwind CSS.
- Backend: Node.js, Express e APIs REST que trocam dados em JSON.
- Persistência: MongoDB, acessado pelos serviços com Mongoose.
- Testes: Jest para as APIs dos serviços e Cypress para fluxos de ponta a ponta.

## Arquitetura

```text
                         FRONTEND
                            |
                         HTTP / JSON
                            v
                     GATEWAY (:3000)
                            |
      +---------------------+---------------------+---------------------+
      |                     |                     |                     |
      v                     v                     v                     v
 EMPRESAS API          VAGAS API          CANDIDATOS API       CANDIDATURAS API
   (:3001)               (:3002)               (:3003)               (:3004)
      |                     |                     |                     |
      v                     v                     v                     v
 8jobs_empresas       8jobs_vagas       8jobs_candidatos    8jobs_candidaturas
```

O frontend envia pedidos ao gateway em `http://localhost:3000/api`. O gateway
encaminha cada recurso ao serviço correspondente. Cada serviço acessa somente o
próprio banco; os bancos não se conectam diretamente entre si.

Quando precisam de dados relacionados, os microserviços consultam as APIs uns
dos outros por HTTP:

- O serviço de vagas consulta a API de empresas para validar `empresaId` e pode
  incluir os dados da empresa nas respostas de vagas.
- O serviço de candidaturas consulta as APIs de candidatos e vagas. Confirma que
  ambos existem e que a vaga está aberta antes de gravar a candidatura.
- A vaga armazena `empresaId`; a candidatura armazena `candidatoId` e `vagaId`.

## Bancos de dados

O projeto utiliza quatro bancos MongoDB, um por microserviço:

| Serviço | Porta | Banco | Coleção |
| --- | ---: | --- | --- |
| Empresas | 3001 | `8jobs_empresas` | `empresas` |
| Vagas | 3002 | `8jobs_vagas` | `vagas` |
| Candidatos | 3003 | `8jobs_candidatos` | `candidatos` |
| Candidaturas | 3004 | `8jobs_candidaturas` | `candidaturas` |

O MongoDB Server precisa estar em execução. O MongoDB Compass é a interface
gráfica para consultar os dados; conecte-se a `mongodb://127.0.0.1:27017` e
abra os bancos `8jobs_*`.

Os scripts da pasta `database/` criam bancos, coleções, índices e dados de
exemplo. Na raiz do projeto, execute:

```powershell
npm.cmd run db:criar
npm.cmd run db:popular
```

`db:criar` pode ser executado novamente para conferir ou criar a estrutura.
`db:popular` inclui exemplos sem substituir registros existentes. O comando
abaixo apaga os registros dos quatro bancos antes de inserir os exemplos; use-o
somente se realmente quiser zerar os dados:

```powershell
npm.cmd run db:popular -- --zerar
```

O endereço do servidor usado pelos scripts vem de `MONGODB_URL` no `.env` da
raiz ou, por padrão, de `mongodb://localhost:27017`. Cada microserviço usa
`MONGODB_URI` no seu próprio `.env`. Os arquivos `.env.example` mostram os
valores locais recomendados.

## Configuração no Windows

Pré-requisitos: Node.js e MongoDB Server instalados. No PowerShell, use
`npm.cmd` e `npx.cmd` se a política de execução do sistema bloquear os scripts
`npm.ps1` ou `npx.ps1`. No Git Bash, use `npm` e `npx` normalmente.

Na raiz do projeto, instale todas as dependências com um único comando. O npm
workspaces inclui o frontend e os quatro serviços:

```powershell
npm.cmd install
```

Na primeira execução, o comando abaixo cria os arquivos `.env` que estiverem
faltando a partir dos exemplos, verifica a conexão com o MongoDB e inicia os
quatro microserviços, o gateway e o frontend:

```powershell
npm.cmd run dev
```

Os arquivos `.env` existentes não são sobrescritos. O `concurrently` identifica
cada processo no terminal. Pressione Ctrl+C para encerrar todos os servidores.
No Git Bash, use `npm install` e `npm run dev` sem o sufixo `.cmd`.

O frontend normalmente fica em `http://localhost:5173`; o gateway fica em
`http://localhost:3000`. Se o Vite mostrar outra porta, use o endereço
apresentado no terminal. O MongoDB Server precisa estar ligado antes de iniciar.

## Rotas do frontend

| Caminho | Página |
| --- | --- |
| `/` | Página inicial e busca de vagas |
| `/vagas` | Lista de vagas |
| `/vagas/:id` | Detalhes de uma vaga |
| `/vagas/cadastrar` | Cadastro de vaga |
| `/cadastro-empresa` | Cadastro de empresa |
| `/cadastro-candidato` | Cadastro de candidato |
| `/candidatos` | Lista de candidatos |
| `/formulario` | Formulário de candidatura |

O endereço base do frontend é definido por `VITE_API_URL`; o padrão é
`http://localhost:3000/api`.

## Rotas das APIs

Os caminhos públicos passam pelo gateway em `/api`. Por exemplo,
`GET /api/vagas` é encaminhado ao serviço de vagas como `GET /vagas`.

Cada recurso oferece as operações abaixo:

| Recurso | Operações |
| --- | --- |
| `/empresas` | `GET`, `GET /:id`, `POST`, `PUT /:id`, `DELETE /:id` |
| `/vagas` | `GET`, `GET /:id`, `POST`, `PUT /:id`, `DELETE /:id` |
| `/candidatos` | `GET`, `GET /:id`, `POST`, `PUT /:id`, `DELETE /:id` |
| `/candidaturas` | `GET`, `GET /:id`, `POST`, `PUT /:id`, `DELETE /:id` |

## Testes

### Jest

Na raiz, execute:

```powershell
npm.cmd test
npm.cmd test -- --verbose
```

Os testes iniciam as aplicações Express em portas temporárias e simulam os
models MongoDB e as chamadas HTTP entre serviços. Por isso, testam regras e
respostas das APIs sem precisar conectar ao MongoDB, iniciar os serviços reais
ou alterar dados persistidos.

### Cypress

Os testes ponta a ponta estão em `cypress/e2e/` e usam a API simulada em
`cypress/support/fakeApi.js`. Não é necessário iniciar o MongoDB, os
microserviços ou o gateway para executar esses testes. Em terminais separados,
na raiz, rode:

```powershell
npm.cmd run dev:frontend
npx.cmd cypress open
```

Para executar Cypress sem abrir a interface:

```powershell
npx.cmd cypress run
```

## Arquivos principais

- `server.js` — gateway Express.
- `frontend/src/App.jsx` — rotas da interface React.
- `frontend/src/services/` — chamadas HTTP do frontend.
- `services/*/src/routes/` — rotas HTTP dos microserviços.
- `services/*/src/controllers/` — regras de negócio e respostas das APIs.
- `services/*/src/models/` — estrutura e validação dos documentos.
- `services/*/src/clients/` — chamadas HTTP entre microserviços.
- `services/*/test/` — testes Jest dos serviços.
- `database/` — conexão, criação dos bancos e dados de exemplo.
- `cypress/` — testes de interface com API simulada.
