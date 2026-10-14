
import { Link } from 'react-router-dom';
import Mark from './mark.jsx';

export default function Header() {
  return (
    // Cabeçalho com fundo branco e borda inferior.
    <header className="border-b border-slate-200/80 bg-white/90">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">

        {/* Marca reutilizável do 8Jobs. */}
        <Mark />

        {/* Navegação principal; os links levam às seções da Home. */}
        <nav
          className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex"
          aria-label="Navegação principal"
        >
          <Link className="text-emerald-700" to="/#vagas">
            Encontrar vagas
          </Link>

          <Link className="hover:text-slate-900" to="/#empresas">
            Para empresas
          </Link>
        </nav>

        {/* Botões de entrada e cadastro, ainda ilustrativos. */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            to="/#entrar"
            className="hidden rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 sm:inline-flex"
          >
            Entrar
          </Link>

          <Link
            to="/#cadastro"
            className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            Criar conta
          </Link>
        </div>
      </div>
    </header>
  );
}
