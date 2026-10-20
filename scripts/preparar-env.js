// ============================================================
// scripts/preparar-env.js
// Objetivo: criar automaticamente os arquivos .env de cada servico.
//
// Por que isso e necessario?
//   O .gitignore do projeto ignora os arquivos .env (correto, pois
//   podem ter senhas). Entao, quem baixa o projeto recebe apenas os
//   arquivos .env.example, e os servicos sobem SEM a variavel
//   MONGODB_URI. Foi isso que causou o erro:
//     "The `uri` parameter to `openUri()` must be a string, got undefined"
//
// O que este script faz:
//   1. Para a raiz e para cada pasta dentro de services/ que tenha
//      um .env.example:
//   2. Se o .env NAO existe, copia o .env.example para .env.
//   3. Se o .env existe mas aponta para um banco DIFERENTE do
//      .env.example (ex.: "8Jobs" em vez de "8jobs_empresas"), faz um
//      backup (.env.bak) e recria o .env a partir do exemplo.
//   4. Se o .env ja esta correto, nao mexe em nada.
//
// Pode rodar quantas vezes quiser sem causar problemas.
// ============================================================

const fs = require("fs");
const path = require("path");

// Pasta raiz do projeto (uma pasta acima de "scripts")
const root = path.join(__dirname, "..");

// Monta a lista de pastas que devem ter um .env:
// a raiz (gateway) + cada subpasta de services/
const pastas = [root];
const pastaServices = path.join(root, "services");

if (fs.existsSync(pastaServices)) {
  for (const item of fs.readdirSync(pastaServices, { withFileTypes: true })) {
    if (item.isDirectory()) {
      pastas.push(path.join(pastaServices, item.name));
    }
  }
}

// Le o valor de MONGODB_URI dentro de um arquivo .env (ou null se nao tiver)
function lerUri(arquivo) {
  const texto = fs.readFileSync(arquivo, "utf8");
  const linha = texto.split(/\r?\n/).find((l) => l.trim().startsWith("MONGODB_URI="));
  return linha ? linha.split("=").slice(1).join("=").trim() : null;
}

// Extrai so o nome do banco de uma URI.
// Exemplo: "mongodb://localhost:27017/8jobs_vagas" -> "8jobs_vagas"
function nomeDoBanco(uri) {
  if (!uri) return null;
  const semParametros = uri.split("?")[0];
  return semParametros.substring(semParametros.lastIndexOf("/") + 1);
}

let criados = 0;
let corrigidos = 0;

for (const pasta of pastas) {
  const exemplo = path.join(pasta, ".env.example");
  const env = path.join(pasta, ".env");
  const nome = path.relative(root, pasta) || "(raiz)";

  // Pasta sem .env.example: nao ha o que copiar
  if (!fs.existsSync(exemplo)) continue;

  // Caso 1: .env nao existe -> cria a partir do exemplo
  if (!fs.existsSync(env)) {
    fs.copyFileSync(exemplo, env);
    console.log(`[env] ${nome}: .env criado a partir do .env.example`);
    criados++;
    continue;
  }

  // Caso 2: .env existe -> confere se o banco e o mesmo do exemplo
  const bancoEsperado = nomeDoBanco(lerUri(exemplo));
  const bancoAtual = nomeDoBanco(lerUri(env));

  if (bancoEsperado && bancoAtual !== bancoEsperado) {
    fs.copyFileSync(env, env + ".bak"); // guarda o arquivo antigo
    fs.copyFileSync(exemplo, env);
    console.log(
      `[env] ${nome}: banco corrigido ("${bancoAtual}" -> "${bancoEsperado}"). Backup em .env.bak`
    );
    corrigidos++;
  }
}

if (criados === 0 && corrigidos === 0) {
  console.log("[env] Todos os arquivos .env ja estao corretos.");
}
