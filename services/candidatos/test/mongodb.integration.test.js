// Testa persistência e hash em MongoDB real quando MONGODB_TEST_URI está configurada.
const mongoose = require('mongoose');
const { conferirSenha } = require('../../shared/passwords');
const Candidato = require('../src/models/candidatoModel');

// Evita tentar conectar a um banco local inexistente durante a suíte padrão.
const suite = process.env.MONGODB_TEST_URI ? describe : describe.skip;

suite('Integração real com MongoDB', () => {
    // Usa um banco temporário isolado para não alterar os dados da aplicação.
    beforeAll(async () => {
        await mongoose.connect(process.env.MONGODB_TEST_URI, {
            dbName: `8jobs_test_${process.pid}`,
            serverSelectionTimeoutMS: 5000
        });
    }, 10000);

    // Apaga somente o banco temporário deste processo e encerra a conexão.
    afterAll(async () => {
        if (mongoose.connection.readyState === 1) await mongoose.connection.dropDatabase();
        await mongoose.disconnect();
    });

    // Confirma que o hash é persistido e que nunca aparece em JSON.
    test('salva senha com hash e lê a conta do banco', async () => {
        const senha = 'SenhaMongo2026!';
        const candidato = await Candidato.create({
            nome: 'Teste MongoDB',
            // Usa um valor de teste com 11 dígitos, diferente para cada processo.
            cpf: String(process.pid).padStart(11, '0').slice(-11),
            email: `mongo-${process.pid}@8jobs.test`,
            senha,
            telefone: '0000000000',
            cidade: 'Teste',
            habilidades: []
        });
        const salvo = await Candidato.findById(candidato._id).select('+senha');
        expect(salvo.senha).not.toBe(senha);
        expect(await conferirSenha(senha, salvo.senha)).toBe(true);
        expect(candidato.toJSON()).not.toHaveProperty('senha');
    });
});
