
import { Link, NavLink } from 'react-router-dom';
import Mark from './mark.jsx';
import { useAuth } from '../auth/AuthContext.jsx';

export default function Navbar() {
  const { usuario, sair } = useAuth();
  // Define a aparência do link conforme a página atual.
  const linkClass = ({ isActive }) =>
    `text-sm font-medium transition hover:text-emerald-600 ${
      isActive ? 'text-emerald-700' : 'text-slate-600'
    }`;

  return (
    // Cabeçalho principal da navegação.
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8"
        aria-label="Navegação principal"
      >
        {/* Logo do 8Jobs, que leva à página inicial. */}
        <Mark />

        {/* Links das páginas públicas. */}
        <div className="hidden items-center gap-7 md:flex">
          <NavLink to="/" end className={linkClass}>
            Início
          </NavLink>

          <NavLink to="/vagas" className={linkClass}>
            Vagas
          </NavLink>
          {!usuario && <Link to="/cadastro-empresa" className="text-sm font-medium text-slate-600 transition hover:text-emerald-600">Cadastrar empresa</Link>}

          {usuario?.role === 'empresa' && <Link to="/vagas/cadastrar" className="text-sm font-medium text-slate-600 transition hover:text-emerald-600">Publicar vaga</Link>}
          {usuario?.role === 'empresa' && <Link to="/candidatos" className="text-sm font-medium text-slate-600 transition hover:text-emerald-600">Candidatos</Link>}
          {usuario?.role === 'empresa' && <NavLink to="/candidaturas" className={linkClass}>Candidaturas</NavLink>}
        </div>

        {/* Ações de acesso à plataforma. */}
        <div className="flex items-center gap-3">
          {usuario ? (
            <button type="button" onClick={() => sair().catch(() => {})} className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white">{usuario.nome} · Sair</button>
          ) : (
            <><Link to="/login" className="text-sm font-semibold text-slate-700">Entrar</Link><Link to="/cadastro-candidato" className="rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white">Criar conta</Link></>
          )}
        </div>
      </nav>
      {usuario?.role === 'empresa' && (
        <div className="border-t border-slate-100 px-5 py-2 md:hidden sm:px-8">
          <NavLink
            to="/candidaturas"
            className={({ isActive }) => `inline-flex rounded-lg px-3 py-2 text-sm font-semibold transition ${isActive ? 'bg-emerald-50 text-emerald-800' : 'text-slate-700 hover:bg-slate-50'}`}
          >
            Candidaturas
          </NavLink>
        </div>
      )}
    </header>
  );
}
