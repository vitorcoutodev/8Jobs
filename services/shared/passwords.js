// Usa funções nativas do Node para proteger senhas sem dependências externas.
// Sem este arquivo, o microserviço de candidatos não poderia criar ou conferir senhas de forma segura
// Manter este arquivo evita duplicação e deixa os serviços usando a mesma lógica.
const { promisify } = require('node:util');
const { randomBytes, scrypt, timingSafeEqual } = require('node:crypto');

// Converte scrypt para uma função assíncrona baseada em Promise.
const derivarChave = promisify(scrypt);
const CUSTO = 16384;
const BLOCOS = 8;
const PARALELISMO = 1;
const TAMANHO_CHAVE = 64;
const MEMORIA_MAXIMA = 64 * 1024 * 1024;

// Gera um salt aleatório e deriva um hash que pode ser salvo no banco.
async function criarHashSenha(senha) {
    const salt = randomBytes(16);
    const hash = await derivarChave(senha, salt, TAMANHO_CHAVE, {
        N: CUSTO,
        r: BLOCOS,
        p: PARALELISMO,
        maxmem: MEMORIA_MAXIMA
    });

    return `scrypt$${CUSTO}$${BLOCOS}$${PARALELISMO}$${salt.toString('hex')}$${hash.toString('hex')}`;
}

// Confere a senha usando comparação de tempo constante para o hash salvo.
async function conferirSenha(senha, hashSalvo) {
    if (typeof senha !== 'string' || typeof hashSalvo !== 'string') return false;

    const partes = hashSalvo.split('$');
    if (partes.length !== 6 || partes[0] !== 'scrypt') return false;

    const [algoritmo, custo, blocos, paralelismo, saltHex, hashHex] = partes;
    if (algoritmo !== 'scrypt' || Number(custo) !== CUSTO || Number(blocos) !== BLOCOS || Number(paralelismo) !== PARALELISMO) {
        return false;
    }
    if (!/^[a-f0-9]{32}$/i.test(saltHex) || !/^[a-f0-9]{128}$/i.test(hashHex)) return false;

    const salt = Buffer.from(saltHex, 'hex');
    const hashEsperado = Buffer.from(hashHex, 'hex');
    const hashRecebido = await derivarChave(senha, salt, TAMANHO_CHAVE, {
        N: CUSTO,
        r: BLOCOS,
        p: PARALELISMO,
        maxmem: MEMORIA_MAXIMA
    });

    return timingSafeEqual(hashRecebido, hashEsperado);
}

module.exports = { criarHashSenha, conferirSenha };
