// ============================================================
// scripts/verificar-mongo.js
// Objetivo: garantir que o MongoDB esta ligado ANTES de subir
// os servicos, e tentar liga-lo automaticamente quando possivel.
//
// Fluxo:
//   1. Tenta conectar no MongoDB (mesmo endereco usado em
//      database/conexao.js).
//   2. Se nao conseguir e o sistema for Windows, tenta iniciar o
//      servico do Windows chamado "MongoDB" (comando "net start").
//      Isso so funciona se o terminal estiver como Administrador.
//   3. Tenta conectar de novo algumas vezes.
//   4. Se ainda assim falhar, mostra o que fazer e encerra com erro
//      (assim o "npm run dev" nao sobe servicos sem banco).
// ============================================================

const { execSync } = require("child_process");
const path = require("path");

// Le o .env da raiz (onde pode existir MONGODB_URL), sem mensagens extras
require("dotenv").config({ path: path.join(__dirname, "..", ".env"), quiet: true });

const mongoose = require("mongoose");

// Endereco do servidor MongoDB (igual ao de database/conexao.js)
const URL_SERVIDOR = process.env.MONGODB_URL || "mongodb://localhost:27017";

// Espera um tempo (em milissegundos)
const esperar = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Tenta conectar uma vez. Devolve true se deu certo, false se nao.
async function tentarConectar() {
  try {
    await mongoose.connect(URL_SERVIDOR, { serverSelectionTimeoutMS: 3000 });
    await mongoose.disconnect(); // so queriamos testar; fecha a conexao
    return true;
  } catch {
    return false;
  }
}

// Tenta ligar o MongoDB como servico do Windows
function tentarLigarServicoWindows() {
  console.log('[mongo] Tentando iniciar o servico "MongoDB" do Windows...');
  try {
    execSync("net start MongoDB", { stdio: "pipe" });
    console.log("[mongo] Servico iniciado.");
  } catch {
    console.log("[mongo] Nao foi possivel iniciar o servico automaticamente.");
    console.log("[mongo] (Isso exige terminal como Administrador, ou o servico nao existe.)");
  }
}

async function main() {
  console.log(`[mongo] Verificando MongoDB em ${URL_SERVIDOR} ...`);

  // 1) Primeira tentativa
  if (await tentarConectar()) {
    console.log("[mongo] MongoDB esta ligado e acessivel.");
    return;
  }

  // 2) Se for Windows, tenta ligar o servico
  if (process.platform === "win32") {
    tentarLigarServicoWindows();

    // 3) Da um tempo para o servico subir e tenta de novo (ate 5 vezes)
    for (let i = 1; i <= 5; i++) {
      await esperar(2000);
      if (await tentarConectar()) {
        console.log("[mongo] MongoDB esta ligado e acessivel.");
        return;
      }
    }
  }

  // 4) Nao conseguiu: explica o que fazer
  console.error("\n[mongo] ERRO: nao foi possivel conectar ao MongoDB.");
  console.error(`[mongo] Endereco testado: ${URL_SERVIDOR}\n`);
  console.error("Como resolver:");
  console.error("  Windows : abra o programa 'Servicos' (services.msc), localize 'MongoDB'");
  console.error("            e clique em Iniciar. Ou rode o terminal como Administrador.");
  console.error("  Linux   : sudo systemctl start mongod");
  console.error("  Mac     : brew services start mongodb-community");
  console.error("  Atlas   : defina MONGODB_URL no arquivo .env da raiz com a URI do Atlas.");
  console.error("\nObs.: o XAMPP NAO traz MongoDB (so MySQL). O MongoDB e instalado a parte.\n");
  process.exit(1);
}

main();
