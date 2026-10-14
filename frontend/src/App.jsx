import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Importa as páginas da aplicação.
import Home from './pages/home.jsx';
import CadastroEmpresa from './pages/cadastroEmpresa.jsx';
import CadastroCandidato from './pages/cadastroCandidato.jsx';
import ListarCandidatos from './pages/listarCandidatos.jsx';
import ListarVagas from './pages/listarVagas.jsx';

export default function App() {
  return (
    // Habilita a navegação pelas URLs no navegador.
    <BrowserRouter>
      {/* Declara as rotas disponíveis no 8Jobs. */}
      <Routes>
        {/* Página inicial. */}
        <Route path="/" element={<Home />} />

        {/* Página cadastro de empresas. */}  
        <Route path="/cadastro-empresa" element={<CadastroEmpresa />}/>

        {/* Página cadastro de candidatos. */} 
        <Route path="/cadastro-candidato" element={<CadastroCandidato />}/>

        {/* Página listar de candidatos. */} 
        <Route path="/candidatos" element={<ListarCandidatos />}/>

        {/* Página com todas as vagas. */}
        <Route path="/vagas" element={<ListarVagas />} />
      </Routes>
    </BrowserRouter>
  );
}
