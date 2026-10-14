
export default function JobCard({ job }) {
  return (
    // Cartão que apresenta uma vaga individual.
    <article className="group rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-lg hover:shadow-slate-200/60 sm:p-6">

      {/* Linha superior: identificação da empresa e ações. */}
      <div className="flex items-start justify-between gap-3">

        {/* Iniciais da empresa dentro de um quadrado colorido. */}
        <div
          className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl text-sm font-bold ${job.color}`}
        >
          {job.initials}
        </div>

        <div className="flex items-center gap-2">
          {/* O selo aparece somente quando featured é true. */}
          {job.featured && (
            <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
              Destaque
            </span>
          )}

          {/* Botão visual de salvar; ainda não possui lógica de favoritos. */}
          <button
            type="button"
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-50 hover:text-emerald-600"
            aria-label={`Salvar vaga ${job.role}`}
          >
            {/* Ícone de marcador desenhado em SVG. */}
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="h-5 w-5"
            >
              <path d="M6 4.75A1.75 1.75 0 0 1 7.75 3h8.5A1.75 1.75 0 0 1 18 4.75V21l-6-3.5L6 21V4.75Z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Cargo, empresa e localização. */}
      <div className="mt-5">
        {/* Link ilustrativo para os futuros detalhes da vaga. */}
        <a
          href="#detalhes"
          className="text-lg font-bold tracking-tight text-slate-900 group-hover:text-emerald-700"
        >
          {job.role}
        </a>

        {/* Exibe a empresa e a cidade da oportunidade. */}
        <p className="mt-1 text-sm text-slate-600">
          {job.company}
          <span className="px-1 text-slate-300">·</span>
          {job.place}
        </p>
      </div>

      {/* Selos que mostram a modalidade e a área da vaga. */}
      <div className="mt-4 flex flex-wrap gap-2 text-xs font-medium text-slate-600">
        <span className="rounded-full bg-slate-100 px-3 py-1.5">
          {job.type}
        </span>

        <span className="rounded-full bg-slate-100 px-3 py-1.5">
          {job.area}
        </span>
      </div>

      {/* Área inferior com salário e data de publicação. */}
      <div className="mt-5 flex items-end justify-between border-t border-slate-100 pt-4">
        <div>
          <p className="text-xs text-slate-500">Faixa salarial</p>

          <p className="mt-1 text-sm font-semibold text-slate-800">
            {job.salary}
          </p>
        </div>

        <span className="text-xs text-slate-400">
          {job.posted}
        </span>
      </div>
    </article>
  );
}
