// database/criar-banco.js
// Cria a ESTRUTURA dos 4 bancos do 8Jobs: cada microserviço tem um banco
// com a sua coleção, e cada coleção recebe os seus índices.
//
// Pode rodar quantas vezes quiser: o que já existe é mantido, nada é apagado.
// Como rodar (na raiz do projeto):  npm run db:criar
//
// Resumo para quem está começando:
//   - servidor MongoDB = o "prédio"
//   - database (banco) = um "armário" (aqui são 4: um por microserviço)
//   - coleção          = uma "gaveta" dentro do armário
//   - documento        = uma "ficha" dentro da gaveta (uma empresa, uma vaga...)
//   - índice           = um "índice de livro": deixa a busca rápida e, quando é "unique",
//                        impede que duas fichas tenham o mesmo valor (ex.: dois e-mails iguais).

const { mongoose, conectar, BANCOS } = require('./conexao');

// Descrição de tudo que cada banco precisa ter.
// servico = de qual microserviço é o banco (o nome do banco vem de BANCOS em conexao.js).
// Cada índice tem: chave (qual campo), opcoes (unique = não pode repetir) e motivo (para explicar).
const estrutura = [
    {
        servico: 'empresas',
        colecao: 'empresas',
        indices: [
            {
                chave: { cnpj: 1 },
                opcoes: { unique: true },
                motivo: 'Não permite duas empresas com o mesmo CNPJ.'
            },
            {
                chave: { email: 1 },
                opcoes: { unique: true },
                motivo: 'Não permite duas empresas com o mesmo e-mail.'
            }
        ]
    },
    {
        servico: 'vagas',
        colecao: 'vagas',
        indices: [
            {
                chave: { empresaId: 1 },
                opcoes: {},
                motivo: 'Acelera "quais vagas esta empresa tem?".'
            },
            {
                chave: { status: 1 },
                opcoes: {},
                motivo: 'Acelera "quais vagas estão ABERTAS?".'
            }
        ]
    },
    {
        servico: 'candidatos',
        colecao: 'candidatos',
        indices: [
            {
                chave: { email: 1 },
                opcoes: { unique: true },
                motivo: 'Não permite dois candidatos com o mesmo e-mail (e acelera a busca por e-mail).'
            }
        ]
    },
    {
        servico: 'candidaturas',
        colecao: 'candidaturas',
        indices: [
            {
                // A combinação candidato + vaga não pode repetir:
                // a mesma pessoa não se candidata duas vezes à mesma vaga.
                chave: { candidatoId: 1, vagaId: 1 },
                opcoes: { unique: true },
                motivo: 'Impede a mesma pessoa de se candidatar duas vezes à mesma vaga.'
            },
            {
                chave: { vagaId: 1 },
                opcoes: {},
                motivo: 'Acelera "quem se candidatou a esta vaga?".'
            }
        ]
    }
];

const criarBanco = async () => {
    const banco = await conectar();

    for (const item of estrutura) {
        // Pega o banco do microserviço (ex.: 8jobs_vagas).
        const db = banco(item.servico);
        console.log(`Banco "${BANCOS[item.servico]}"`);

        // Descobre quais coleções já existem nesse banco para não tentar criar de novo.
        const existentes = (await db.listCollections({}, { nameOnly: true }).toArray()).map((c) => c.name);

        // 1) Cria a coleção (a "gaveta") se ela ainda não existir.
        //    O banco em si passa a existir quando a primeira coleção é criada.
        if (existentes.includes(item.colecao)) {
            console.log(`   coleção "${item.colecao}": já existia`);
        } else {
            await db.createCollection(item.colecao);
            console.log(`   coleção "${item.colecao}": criada`);
        }

        // 2) Cria os índices. Se o índice já existe igual, o MongoDB simplesmente mantém.
        for (const indice of item.indices) {
            try {
                await db.collection(item.colecao).createIndex(indice.chave, indice.opcoes);
                console.log(`   índice ${JSON.stringify(indice.chave)}${indice.opcoes.unique ? ' (único)' : ''} - ${indice.motivo}`);
            } catch (erro) {
                // Código 11000 = já existem dados repetidos, então o índice único não pode ser criado.
                if (erro.code === 11000) {
                    console.error(`   NÃO foi possível criar o índice único ${JSON.stringify(indice.chave)}:`);
                    console.error(`   já existem registros repetidos em "${item.colecao}". Corrija os repetidos e rode de novo.`);
                } else {
                    throw erro;
                }
            }
        }
        console.log('');
    }

    console.log('Bancos prontos. Para encher com dados de exemplo: npm run db:popular');
    await mongoose.disconnect();
};

criarBanco().catch((erro) => {
    console.error('Erro ao criar o banco:', erro.message);
    process.exit(1);
});
