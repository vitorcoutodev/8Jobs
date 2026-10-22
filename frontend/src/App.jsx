import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Páginas da aplicação.
import Home from './pages/home.jsx';
import ListarVagas from './pages/listarVagas.jsx';
import DetalhesVaga from './pages/detalhesVaga.jsx';
import CadastroVaga from './pages/cadastroVaga.jsx';
import CadastroEmpresa from './pages/cadastroEmpresa.jsx';
import CadastroCandidato from './pages/cadastroCandidato.jsx';
import ListarCandidatos from './pages/listarCandidatos.jsx';
import CandidaturaPage from './pages/CandidaturaPage.jsx';
import Login from './pages/login.jsx';

// Componentes de autenticação.
import RequireAuth from './components/RequireAuth.jsx';
import { AuthProvider } from './auth/AuthContext.jsx';

export default function App() {
  return (
    <AuthProvider> {/* Fornece o contexto de autenticação para toda a aplicação. */}
    <BrowserRouter> {/* Gerencia a navegação entre páginas sem recarregar a página inteira. */}
      <Routes>
        {/* Página inicial. */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        {/* Cadastro de empresas. */}
        <Route path="/cadastro-empresa" element={<CadastroEmpresa />} />

        {/* Cadastro de candidatos. */}
        <Route path="/cadastro-candidato" element={<CadastroCandidato />} />

        {/* Listagem de candidatos.
        A listagem de candidatos é protegida e só pode ser acessada por empresas autenticadas.
        Se a pessoa estiver logada com o perfil errado, será redirecionada. */}
        <Route path="/candidatos" element={<RequireAuth role="empresa"><ListarCandidatos /></RequireAuth>} />

        {/* Listagem de vagas. */}
        <Route path="/vagas" element={<ListarVagas />} />

        {/* Detalhes de uma vaga. */}
        <Route path="/vagas/:id" element={<DetalhesVaga />} />

        {/* Cadastro de vagas.
        O cadastro de vagas é protegido e só pode ser acessado por empresas autenticadas.
        Se a pessoa estiver logada com o perfil errado, será redirecionada. */}
        <Route path="/vagas/cadastrar" element={<RequireAuth role="empresa"><CadastroVaga /></RequireAuth>} />

        {/* Formulário de candidatura.
        O formulário de candidatura é protegido e só pode ser acessado por candidatos autenticados.
        Se a pessoa estiver logada com o perfil errado, será redirecionada. */}
        <Route path="/formulario" element={<RequireAuth role="candidato"><CandidaturaPage /></RequireAuth>} />
      </Routes>
    </BrowserRouter>
    </AuthProvider>
  );
}
