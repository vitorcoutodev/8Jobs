// ponto de entrada do React. Encontra o elemento root e renderiza o componente App.
// Importa o React para disponibilizar a API de componentes e o modo estrito.
import React from 'react'
// Importa a função que conecta a aplicação React ao elemento HTML raiz.
import { createRoot } from 'react-dom/client'
// Importa o componente principal que renderiza a página inicial.
import App from './App.jsx'
// Importa os estilos globais e a configuração do Tailwind CSS.
import './index.css'

// Localiza a div raiz no HTML e nela monta a aplicação React.
createRoot(document.getElementById('root')).render(
  // Ativa avisos extras de desenvolvimento para ajudar a identificar problemas.
  <React.StrictMode>
    {/* Renderiza a interface principal do 8Jobs. */}
    <App />
  {/* Fecha o modo estrito e encerra a chamada de renderização. */}
  </React.StrictMode>,
)
