
import { Link } from 'react-router-dom';

export default function Mark() {
  return (
    // O logotipo leva o usuário à página inicial do 8Jobs.
    <Link
      to="/"
      className="flex items-center gap-2.5 font-extrabold tracking-tight text-slate-900"
      aria-label="8Jobs, início"
    >
      {/* Quadrado verde com o número 8. */}
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-500 text-lg text-white">
        8
      </span>

      {/* Nome da marca com o ponto verde. */}
      <span className="text-xl">
        jobs<span className="text-emerald-500">.</span>
      </span>
    </Link>
  );
}
