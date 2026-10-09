## Criando o package.json

Dentro de um microserviço, eu dou o comando:

npm init -y

Esse comando cria dentro da pasta do microserviço um arquivo chamado package.json.

O package.json guarda informações como:

- nome do projeto;
- versão;
- comandos;
- dependências, como o Express.

O `-y` significa aceitar as configurações padrão automaticamente,
sem ficar fazendo perguntas.

------------------------  // ----------------------------

## Instalando o Express

Depois de criar o `package.json`, dentro da pasta do microserviço eu dei o comando:

npm install express

O que esse comando faz:

- instala o Express no microserviço;
- adiciona o Express como dependência no package.json;
- cria a pasta node_modules, onde ficam os pacotes instalados;
- cria/atualiza o package-lock.json, que registra as versões das dependências instaladas.

O Express é um framework do Node.js que vamos usar para criar nossa API e suas rotas HTTP.

Exemplo:

GET /empresas
POST /empresas
PUT /empresas/:id
DELETE /empresas/:id

------------------------  // ----------------------------
## Entendendo o código do Express

```js
const express = require("express");
const       express       =       require("express")
 ↓             ↓          ↓              ↓
cria       nome da       recebe       importa
variável   variável      o resultado   Express

const app = express();
const       app       =       express()
 ↓           ↓        ↓           ↓
cria       nome      recebe      executa
variável   variável  o resultado  a função

const PORT = 3001;
const       PORT       =       3001
 ↓           ↓         ↓          ↓
cria       nome da   recebe      número
variável   variável  o valor     da porta

app.use(express.json());   
app        .        use        (        express.json()        )
 ↓         ↓         ↓         ↓              ↓               ↓
applicação acessa   usa       abre      prepara o JSON       fecha
                a função       os
                           parênteses

app.get("/", (req, res) => {
app        .        get        (        "/"        ,       (req, res)       =>       {
 ↓         ↓         ↓         ↓         ↓         ↓           ↓             ↓       ↓
applicação acessa   cria      abre     endereço   separa     recebe       cria uma  começa
                     GET      os       da rota   os         requisição    função   o bloco
                              argumentos          argumentos e resposta

res.json{(
res        .        json        (        {        ...        }        )
 ↓         ↓         ↓          ↓        ↓                  ↓        ↓
resposta  acessa   envia      abre     começa             fecha    fecha
                     JSON      os       o objeto            o       os
                              argumentos                    objeto argumentos

mensagem: "Microserviço empresa funcionando!"
mensagem        :        "Microserviço empresa funcionando!"
    ↓           ↓                    ↓
  chave       separa              valor
              chave do
              valor

        });
        }        )
        ↓      ↓
        fecha   fecha
        objeto  função json

});
}        )
  ↓      ↓
fecha   fecha
bloco   argumentos
da rota da função

app.listen(PORT, () => {
app        .        listen        (        PORT        ,        () =>        {
 ↓         ↓          ↓           ↓          ↓          ↓          ↓          ↓
applicação acessa   inicia       abre      porta      separa    função      começa
                     servidor    os        usada                 executada   bloco
                                 argumentos

console.log(`Servidor rodando em http://localhost:${PORT}`);
console        .        log        (        `Servidor rodando em http://localhost:${PORT}`        )
   ↓           ↓         ↓         ↓                         ↓                                    ↓
terminal     acessa    mostra     abre              mensagem com a variável PORT                 fecha
                      mensagem 
                         os 
                      argumentos

As crases:
` `
permitem colocar uma variável dentro do texto usando:
${PORT}
Como:
const PORT = 3001;
o resultado será:
Servidor rodando em http://localhost:3001
