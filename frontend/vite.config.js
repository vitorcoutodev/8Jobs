// Importa o helper que valida e organiza a configuração do Vite, para reconhecer React e Tailwind. Pode iniciar o servidor local para você ver o site no navegador
import { defineConfig } from 'vite'
// Importa o plugin que habilita a transformação de componentes React e JSX.
import react from '@vitejs/plugin-react'
// Importa o plugin oficial que integra Tailwind CSS ao Vite.
import tailwindcss from '@tailwindcss/vite'

// Exporta as opções usadas pelo servidor local e pela compilação do front-end.
export default defineConfig({
  // Registra os plugins React e Tailwind no processo de desenvolvimento.
  plugins: [react(), tailwindcss()],
  // Define as opções para servir a aplicação localmente.
  server: {
    // Permite conexões por interfaces de rede disponíveis na máquina.
    host: '0.0.0.0',
    // Escolhe a porta usada pelo servidor de desenvolvimento do Vite.
    port: 5173,
  },
})
