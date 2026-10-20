// database/popular-banco.js
// Coloca DADOS DE EXEMPLO nos 4 bancos (um por microserviço), para testar o sistema
// e apresentar o projeto.
//
// Como rodar (na raiz do projeto):
//   npm run db:popular              -> adiciona os exemplos (pode repetir sem duplicar)
//   npm run db:popular -- --zerar   -> APAGA TUDO dos 4 bancos e depois adiciona os exemplos
//
// Os exemplos seguem as mesmas regras dos microserviços:
//   - toda vaga aponta para uma empresa que existe (em outro banco: a ligação é só o ID);
//   - toda candidatura aponta para um candidato e uma vaga que existem.

const { mongoose, conectar } = require('./conexao');

// Cada registro tem um ID FIXO. Assim, ao rodar o script de novo, o MongoDB reconhece
// que o registro já existe e não cria uma cópia. Também permite ligar um registro ao outro.
const gerarId = (numero) => new mongoose.Types.ObjectId(String(numero).padStart(24, '0'));

const ID = {
    empresa: { techVale: gerarId(1), studioPixel: gerarId(2), graoNobre: gerarId(3) },
    vaga: { devNode: gerarId(11), designer: gerarId(12), atendente: gerarId(13), analista: gerarId(14) },
    candidato: { ana: gerarId(21), bruno: gerarId(22), carla: gerarId(23) }
};

const agora = new Date();

// ---------- EMPRESAS ----------
const empresas = [
    { _id: ID.empresa.techVale, nome: 'Tech Vale Soluções', cnpj: '11.111.111/0001-11', email: 'rh@techvale.com.br', telefone: '(51) 3000-1111', cidade: 'São Leopoldo' },
    { _id: ID.empresa.studioPixel, nome: 'Studio Pixel', cnpj: '22.222.222/0001-22', email: 'contato@studiopixel.com.br', telefone: '(51) 3000-2222', cidade: 'Novo Hamburgo' },
    { _id: ID.empresa.graoNobre, nome: 'Grão Nobre Cafés', cnpj: '33.333.333/0001-33', email: 'vagas@graonobre.com.br', telefone: '(51) 3000-3333', cidade: 'Porto Alegre' }
];

// ---------- VAGAS ----------
// empresaId = ID da empresa dona da vaga (é assim que uma coleção "aponta" para outra).
const vagas = [
    { _id: ID.vaga.devNode, titulo: 'Desenvolvedor Node.js Júnior', descricao: 'Desenvolver e manter APIs REST com Node.js, Express e MongoDB.', requisitos: 'Node.js, Express, MongoDB, Git', salario: 4500, modalidade: 'Remoto', cidade: 'São Leopoldo', empresaId: ID.empresa.techVale, status: 'ABERTA' },
    { _id: ID.vaga.designer, titulo: 'Designer de Interfaces (UI)', descricao: 'Criar telas e protótipos para aplicativos e sites.', requisitos: 'Figma, noções de HTML e CSS', salario: 3800, modalidade: 'Híbrido', cidade: 'Novo Hamburgo', empresaId: ID.empresa.studioPixel, status: 'ABERTA' },
    { _id: ID.vaga.atendente, titulo: 'Atendente de Cafeteria', descricao: 'Atendimento ao público e preparo de bebidas.', requisitos: 'Boa comunicação, disponibilidade aos fins de semana', salario: 2100, modalidade: 'Presencial', cidade: 'Porto Alegre', empresaId: ID.empresa.graoNobre, status: 'ABERTA' },
    // Vaga FECHADA de propósito: serve para testar que o sistema recusa candidaturas a ela.
    { _id: ID.vaga.analista, titulo: 'Analista de Dados Pleno', descricao: 'Criar relatórios e dashboards para a diretoria.', requisitos: 'SQL, Power BI, estatística básica', salario: 7000, modalidade: 'Híbrido', cidade: 'São Leopoldo', empresaId: ID.empresa.techVale, status: 'FECHADA' }
];

// ---------- CANDIDATOS ----------
const candidatos = [
    { _id: ID.candidato.ana, nome: 'Ana Souza', email: 'ana.souza@exemplo.com', telefone: '(51) 99999-0001', cidade: 'São Leopoldo', habilidades: ['Node.js', 'React', 'MongoDB'] },
    { _id: ID.candidato.bruno, nome: 'Bruno Lima', email: 'bruno.lima@exemplo.com', telefone: '(51) 99999-0002', cidade: 'Novo Hamburgo', habilidades: ['Figma', 'CSS', 'Photoshop'] },
    { _id: ID.candidato.carla, nome: 'Carla Mendes', email: 'carla.mendes@exemplo.com', telefone: '(51) 99999-0003', cidade: 'Porto Alegre', habilidades: ['Atendimento', 'Barista'] }
];

// ---------- CANDIDATURAS ----------
// candidatoId + vagaId = quem se candidatou e a qual vaga.
const candidaturas = [
    { _id: gerarId(31), candidatoId: ID.candidato.ana, vagaId: ID.vaga.devNode, status: 'EM_ANALISE', data: agora },
    { _id: gerarId(32), candidatoId: ID.candidato.bruno, vagaId: ID.vaga.designer, status: 'ENVIADA', data: agora },
    { _id: gerarId(33), candidatoId: ID.candidato.carla, vagaId: ID.vaga.atendente, status: 'APROVADA', data: agora }
];

// Grava uma lista de registros em uma coleção, sem duplicar os que já existem.
const gravar = async (db, nomeColecao, registros) => {
    // db = o banco do microserviço dono desta coleção.
    let novos = 0;
    let jaExistiam = 0;
    let conflitos = 0;

    for (const { _id, ...campos } of registros) {
        try {
            // upsert = "se não existir, cria". $setOnInsert = "só preenche se for novo",
            // então um registro que você já editou no banco não é sobrescrito.
            const resultado = await db.collection(nomeColecao).updateOne(
                { _id },
                { $setOnInsert: { ...campos, createdAt: agora, updatedAt: agora } },
                { upsert: true }
            );
            if (resultado.upsertedCount) novos++;
            else jaExistiam++;
        } catch (erro) {
            // 11000 = o CNPJ ou e-mail já está em uso por OUTRO registro: pula este.
            if (erro.code === 11000) conflitos++;
            else throw erro;
        }
    }

    let linha = `${db.databaseName}.${nomeColecao}: ${novos} novo(s), ${jaExistiam} já existia(m)`;
    if (conflitos) linha += `, ${conflitos} pulado(s) por CNPJ/e-mail já em uso`;
    console.log(linha);
};

const popularBanco = async () => {
    const banco = await conectar();

    // Só apaga se você pedir com --zerar. Atenção: apaga TODOS os registros dos 4 bancos, inclusive os seus.
    if (process.argv.includes('--zerar')) {
        console.log('--zerar: apagando todos os registros dos 4 bancos...');
        for (const nome of ['candidaturas', 'candidatos', 'vagas', 'empresas']) {
            const { deletedCount } = await banco(nome).collection(nome).deleteMany({});
            console.log(`   ${banco(nome).databaseName}.${nome}: ${deletedCount} apagado(s)`);
        }
        console.log('');
    }

    // Ordem importa: primeiro quem é "apontado" (empresas, candidatos), depois quem aponta.
    // Cada coleção vai para o banco do seu microserviço: banco('vagas') = 8jobs_vagas.
    await gravar(banco('empresas'), 'empresas', empresas);
    await gravar(banco('candidatos'), 'candidatos', candidatos);
    await gravar(banco('vagas'), 'vagas', vagas);
    await gravar(banco('candidaturas'), 'candidaturas', candidaturas);

    console.log('\nPronto! Abra o Compass, conecte em mongodb://localhost:27017 e veja os 4 databases 8jobs_*.');
    await mongoose.disconnect();
};

popularBanco().catch((erro) => {
    console.error('Erro ao popular o banco:', erro.message);
    process.exit(1);
});
