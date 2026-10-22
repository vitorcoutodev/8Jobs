// Copia arquivos de exemplo para a configuração local sem substituir segredos existentes.
const fs = require('node:fs');
const path = require('node:path');

// Resolve o caminho da raiz do repositório a partir da localização deste script.
const raiz = path.resolve(__dirname, '..');

// Cria os arquivos .env ausentes do gateway e dos quatro microserviços.
for (const pasta of ['', 'services/empresas', 'services/vagas', 'services/candidatos', 'services/candidaturas']) {
    const exemplo = path.join(raiz, pasta, '.env.example');
    const destino = path.join(raiz, pasta, '.env');
    if (fs.existsSync(exemplo) && !fs.existsSync(destino)) {
        fs.copyFileSync(exemplo, destino);
        console.log(`Configuração local criada: ${pasta || 'raiz'}/.env`);
    }
}
