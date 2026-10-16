
import { Link, NavLink } from 'react-router-dom';
import Mark from './mark.jsx';

export default function Navbar() {
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

          <Link to="/cadastro-empresa" className={linkClass}>
            Cadastrar empresa
          </Link>
        </div>

        {/* Ações de acesso à plataforma. */}
        <div className="flex items-center gap-3">
          <Link
            to="/cadastro-candidato"
            className="rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-600"
          >
            Criar conta
          </Link>
        </div>
      </nav>
    </header>
  );
}
