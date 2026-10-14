
import { BrowserRouter, Routes, Route } from 'react-router-dom';
// Importa as páginas da aplicação.
import Home from './pages/home.jsx';
import CadastroEmpresa from './pages/cadastroEmpresa.jsx';
import CadastroCandidato from './pages/cadastroCandidato.jsx';
import ListarCandidatos from './pages/listarCandidatos.jsx';
import ListarVagas from './pages/listarVagas.jsx';
import CandidaturaPage from './pages/CandidaturaPage.jsx';

export default function App() {
  return (
    // Habilita a navegação pelas URLs no navegador.
    <BrowserRouter>
      {/* Declara as rotas disponíveis no 8Jobs. */}
      <Routes>
        {/* Redireciona a página inicial diretamente para o formulário de candidatura. */}
       <Route path="/" element={<Home />} />

        {/* Página inicial original. */}
        <Route path="/inicio" element={<Home />} />

        {/* Página de cadastro de empresas. */}
        <Route path="/cadastro-empresa" element={<CadastroEmpresa />} />

        {/* Página de cadastro de candidatos. */}
        <Route path="/cadastro-candidato" element={<CadastroCandidato />} />

        {/* Página de listagem de candidatos. */}
        <Route path="/candidatos" element={<ListarCandidatos />} />

        {/* Página com todas as vagas. */}
        <Route path="/vagas" element={<ListarVagas />} />

        {/* Página do formulário para se candidatar a uma vaga. */}
        <Route path="/formulario" element={<CandidaturaPage />} />
      </Routes>
    </BrowserRouter>
  );
}
