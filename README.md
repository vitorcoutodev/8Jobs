# 8Jobs

Plataforma de vagas de emprego. Empresas cadastram oportunidades; candidatos
consultam as vagas e enviam candidaturas.

## Funcionalidades

- Cadastrar, consultar, atualizar e excluir empresas.
- Cadastrar, consultar, atualizar e excluir vagas.
- Cadastrar, consultar, atualizar e excluir candidatos.
- Criar e consultar candidaturas, alterar seu status e excluí-las.
- Consultar vagas pela interface React e enviar candidaturas pelo formulário.
- Cadastrar e autenticar candidatos e empresas com sessão armazenada no MongoDB.
- Restringir a publicação de vagas e o acesso aos dados de candidatos por tipo de conta.
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
encaminha cada recurso ao serviço correspondente e armazena as sessões em
`8jobs_sessions`. Os quatro serviços de domínio acessam cada um o próprio banco;
as portas dos serviços ficam limitadas ao endereço local para receber chamadas
pelo gateway.

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
| Sessões do gateway | — | `8jobs_sessions` | `sessions` |

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

Na raiz do projeto, instale as dependências do gateway, dos testes e do frontend:

```powershell
npm.cmd run setup
```

O comando abaixo cria os arquivos `.env` que estiverem faltando a partir dos
exemplos e inicia os quatro microserviços, o gateway e o frontend. Arquivos
locais existentes não são sobrescritos:

```powershell
npm.cmd run dev
```

Os arquivos `.env` existentes não são sobrescritos. O `concurrently` identifica
cada processo no terminal. Pressione Ctrl+C para encerrar todos os servidores.
No Git Bash, use `npm install` e `npm run dev` sem o sufixo `.cmd`.

O frontend normalmente fica em `http://localhost:5173`; o gateway fica em
`http://localhost:3000`. Se o Vite mostrar outra porta, use o endereço
apresentado no terminal. O MongoDB Server precisa estar ligado antes de iniciar.
Em produção, defina `SESSION_SECRET` como uma chave aleatória forte e use HTTPS
para que o cookie de sessão seja enviado apenas em conexões seguras.

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
| `/login` | Entrada de candidatos e empresas |

O endereço base do frontend é definido por `VITE_API_URL`; o padrão é
`http://localhost:3000/api`.

### Cadastro, login e sessões

Candidatos e empresas criam contas com senha de pelo menos 8 caracteres. O
microserviço da conta usa o `scrypt` nativo do Node para salvar somente o hash; consultas normais
não selecionam a senha e a serialização remove o hash. O login valida as
credenciais no microserviço correspondente e cria uma sessão HTTP no gateway,
armazenada em `8jobs_sessions`. O cookie é `HttpOnly`, usa `SameSite=Lax`, tem
validade de sete dias e o gateway limita tentativas de login.

O cadastro inicia a sessão automaticamente. Candidatos autenticados podem se
candidatar. Empresas autenticadas podem publicar vagas, consultar candidatos e
gerenciar candidaturas de vagas próprias. O gateway confere o papel e a
propriedade do registro; os microserviços escutam somente em `127.0.0.1`.

Para demonstrar os dados de exemplo criados por `npm run db:popular`, use
`ana.souza@exemplo.com` (candidato) ou `rh@techvale.com.br` (empresa), com a
senha local `8JobsDemo2026!`. Essa senha é somente para contas de demonstração.

Contas antigas sem senha não podem entrar com o novo login. Para habilitá-las
com segurança, falta um fluxo de redefinição de senha com validação de e-mail.
Também ficam como melhorias de produto a confirmação do e-mail e a interface
para alterar a senha; elas exigem um fluxo seguro de e-mail e recuperação.


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
| `/auth/login` | `POST` com tipo da conta, e-mail e senha |
| `/auth/me` | `GET` para consultar a sessão atual |
| `/auth/logout` | `POST` para encerrar a sessão |

## Testes

### Jest

O arquivo de configuração fica em `services/jest.config.js`. Na raiz, execute:

```powershell
npm.cmd test
npm.cmd test -- --verbose
```

Para testar a persistência e o hash contra MongoDB real, configure uma URI de
teste temporária e execute:

```powershell
$env:MONGODB_TEST_URI = 'mongodb://127.0.0.1:27017'
npm.cmd run test:mongodb
Remove-Item Env:MONGODB_TEST_URI
```

Os testes iniciam as aplicações Express em portas temporárias e simulam os
models MongoDB e as chamadas HTTP entre serviços. A suíte também verifica
sessões, papéis de acesso e validação de hashes sem alterar dados persistidos.
O teste de integração real está em
`services/candidatos/test/mongodb.integration.test.js`; configure
`MONGODB_TEST_URI` para executá-lo. Ele cria e remove somente o banco temporário
`8jobs_test_<pid>`.

### Cypress

Os testes ponta a ponta estão em `cypress/e2e/` e usam a API simulada em
`cypress/support/fakeApi.js`. Não é necessário iniciar o MongoDB, os
microserviços ou o gateway para executar esses testes. Em terminais separados,
na raiz, rode:

```powershell
npm.cmd run dev:frontend
npx.cmd cypress open --project . --config-file cypress/cypress.config.js
```

Para executar Cypress sem abrir a interface:

```powershell
npx.cmd cypress run --project . --config-file cypress/cypress.config.js
```

## Arquivos principais

- `gateway/server.js` — inicia o gateway Express.
- `gateway/app.js` — sessões, login, autorização por papel e proxy da API.
- `scripts/prepare-env.js` — cria arquivos `.env` locais sem sobrescrever os existentes.
- `frontend/src/App.jsx` — rotas da interface React.
- `frontend/src/services/` — chamadas HTTP do frontend.
- `services/*/src/routes/` — rotas HTTP dos microserviços.
- `services/*/src/controllers/` — regras de negócio e respostas das APIs.
- `services/*/src/models/` — estrutura e validação dos documentos.
- `services/*/src/clients/` — chamadas HTTP entre microserviços.
- `services/*/test/` — testes Jest dos serviços.
- `database/` — conexão, criação dos bancos e dados de exemplo.
- `cypress/` — testes de interface com API simulada.
