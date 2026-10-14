
import { Link } from 'react-router-dom';
import Mark from './mark.jsx';

export default function Footer() {
  return (
    // Rodapé com borda superior e fundo branco.
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-8">

        {/* Logotipo da plataforma. */}
        <Mark />

        {/* Aviso institucional no rodapé. */}
        <p>© 2026 8Jobs. Conectando talentos a oportunidades.</p>

        {/* Link provisório para a futura área do candidato. */}
        <Link to="/#candidato" className="font-medium hover:text-emerald-700">
          Sou candidato
        </Link>
      </div>
    </footer>
  );
}
