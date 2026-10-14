
<<<<<<< HEAD
import { BrowserRouter, Routes, Route } from 'react-router-dom';
// Importa as páginas da aplicação.
=======
// Importa as páginas existentes da aplicação.
>>>>>>> fce66d8d8b6906bb1377819ae9b39ce7813ecea5
import Home from './pages/home.jsx';
import CadastroEmpresa from './pages/cadastroEmpresa.jsx';
import CadastroCandidato from './pages/cadastroCandidato.jsx';
import ListarCandidatos from './pages/listarCandidatos.jsx';

// Importa as três páginas da tarefa de vagas.
import ListarVagas from './pages/listarVagas.jsx';
<<<<<<< HEAD
import CandidaturaPage from './pages/CandidaturaPage.jsx';
=======
import DetalhesVaga from './pages/detalhesVaga.jsx';
import CadastroVaga from './pages/cadastroVaga.jsx';
>>>>>>> fce66d8d8b6906bb1377819ae9b39ce7813ecea5

export default function App() {
  return (
    // Habilita a navegação entre páginas sem recarregar o site inteiro.
    <BrowserRouter>
      {/* Declara as URLs e o componente que cada URL deve exibir. */}
      <Routes>
<<<<<<< HEAD
        {/* Redireciona a página inicial diretamente para o formulário de candidatura. */}
       <Route path="/" element={<Home />} />

        {/* Página inicial original. */}
        <Route path="/inicio" element={<Home />} />

        {/* Página de cadastro de empresas. */}
        <Route path="/cadastro-empresa" element={<CadastroEmpresa />} />

        {/* Página de cadastro de candidatos. */}
        <Route path="/cadastro-candidato" element={<CadastroCandidato />} />

=======
        {/* Página inicial da plataforma. */}
        <Route path="/" element={<Home />} />

        {/* Página de cadastro de empresas. */}
        <Route path="/cadastro-empresa" element={<CadastroEmpresa />} />

        {/* Página de cadastro de candidatos. */}
        <Route path="/cadastro-candidato" element={<CadastroCandidato />} />

>>>>>>> fce66d8d8b6906bb1377819ae9b39ce7813ecea5
        {/* Página de listagem de candidatos. */}
        <Route path="/candidatos" element={<ListarCandidatos />} />

        {/* Lista todas as vagas cadastradas. */}
        <Route path="/vagas" element={<ListarVagas />} />

<<<<<<< HEAD
        {/* Página do formulário para se candidatar a uma vaga. */}
        <Route path="/formulario" element={<CandidaturaPage />} />
=======
        {/* Exibe os detalhes de uma vaga a partir do ID presente na URL. */}
        <Route path="/vagas/:id" element={<DetalhesVaga />} />

        {/* Abre o formulário para cadastrar uma nova vaga. */}
        <Route path="/vagas/cadastrar" element={<CadastroVaga />} />
>>>>>>> fce66d8d8b6906bb1377819ae9b39ce7813ecea5
      </Routes>
    </BrowserRouter>
  );
}
