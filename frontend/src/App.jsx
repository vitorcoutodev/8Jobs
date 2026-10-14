import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Importa as páginas da aplicação.
import Home from './pages/home.jsx';
import CadastroEmpresa from './pages/cadastroEmpresa.jsx';
import CadastroCandidato from './pages/cadastroCandidato.jsx';
import ListarCandidatos from './pages/listarCandidatos.jsx';

// Importa as páginas relacionadas às vagas.
import ListarVagas from './pages/listarVagas.jsx';
import DetalhesVaga from './pages/detalhesVaga.jsx';
import CadastroVaga from './pages/cadastroVaga.jsx';

// Importa o formulário de candidatura.
import CandidaturaPage from './pages/CandidaturaPage.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Página inicial. */}
        <Route path="/" element={<Home />} />

        {/* Cadastro de empresas. */}
        <Route path="/cadastro-empresa" element={<CadastroEmpresa />} />

        {/* Cadastro de candidatos. */}
        <Route path="/cadastro-candidato" element={<CadastroCandidato />} />

        {/* Listagem de candidatos. */}
        <Route path="/candidatos" element={<ListarCandidatos />} />

        {/* Listagem de vagas. */}
        <Route path="/vagas" element={<ListarVagas />} />

        {/* Detalhes de uma vaga. */}
        <Route path="/vagas/:id" element={<DetalhesVaga />} />

        {/* Cadastro de vagas. */}
        <Route path="/vagas/cadastrar" element={<CadastroVaga />} />

        {/* Formulário de candidatura. */}
        <Route path="/formulario" element={<CandidaturaPage />} />
      </Routes>
    </BrowserRouter>
  );
}